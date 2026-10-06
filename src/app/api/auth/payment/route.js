import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import User from '../../../../../models/user';

import { connectDB } from '../../../../../lib/db';
import PaymentMethod from '../../../../../models/PaymentMethod';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET: Retrieve saved payment methods for logged-in user
export async function GET(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        const paymentMethods = await PaymentMethod.find({ userId, status: { $ne: 'inactive' } });

        return NextResponse.json({
            success: true,
            data: paymentMethods
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        const body = await request.json();
        const { paymentMethodId, cardholderName, billingCountry } = body;

        if (!paymentMethodId) {
            return NextResponse.json({ success: false, error: 'Payment Method ID is required!' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found!' }, { status: 404 });
        }

        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email || decodedUser.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || cardholderName || 'Customer'
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // Retrieve Payment Method from Stripe
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // Safe attachment handling: agar already kisi customer se attach hai toh detach karke current customer ko attach kar dein
        if (paymentMethod.customer && paymentMethod.customer !== customerId) {
            try {
                await stripe.paymentMethods.detach(paymentMethodId);
            } catch (e) {
                // Ignore if already detached or restricted
            }
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        } else if (!paymentMethod.customer) {
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        }

        // Check for duplicates in DB and remove old active cards if updating
        await PaymentMethod.deleteMany({ userId }); // Purana card replace karke naya save karne ke liye

        // Save safe metadata in MongoDB
        const savedCard = await PaymentMethod.create({
            userId,
            stripeCustomerId: customerId,
            stripePaymentMethodId: paymentMethod.id,
            cardBrand: paymentMethod.card.brand,
            cardLast4: paymentMethod.card.last4,
            expiryMonth: paymentMethod.card.exp_month,
            expiryYear: paymentMethod.card.exp_year,
            cardholderName: cardholderName || paymentMethod.billing_details?.name || '',
            billingCountry: billingCountry || paymentMethod.billing_details?.address?.country || '',
            status: 'active'
        });

        return NextResponse.json({
            success: true,
            message: 'Payment method saved successfully!',
            data: savedCard
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}