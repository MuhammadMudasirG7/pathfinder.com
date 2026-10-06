import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import User from '../../../../../../models/user';
import { connectDB } from '../../../../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found!' }, { status: 404 });
        }

        // Check if user already has a stripeCustomerId saved in User model, else create one
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer'
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // Create SetupIntent without payment_method_types (managed via Stripe Dashboard now)
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            usage: 'off_session'
        });

        return NextResponse.json({
            success: true,
            clientSecret: setupIntent.client_secret,
            customerId: customerId
        }, { status: 200 });

    }catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}