import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import PaymentMethod from '../../../../../models/PaymentMethod';
import { connectDB } from '../../../../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        const { paymentMethodId } = params;

        // Verify ownership in DB
        const cardRecord = await PaymentMethod.findOne({ stripePaymentMethodId: paymentMethodId, userId });
        if (!cardRecord) {
            return NextResponse.json({ success: false, error: 'Payment method not found or unauthorized!' }, { status: 404 });
        }

        // Detach from Stripe
        try {
            await stripe.paymentMethods.detach(paymentMethodId);
        } catch (stripeErr) {
            console.error('Stripe detach error:', stripeErr.message);
        }

        // Remove or mark inactive in MongoDB
        await PaymentMethod.deleteOne({ stripePaymentMethodId: paymentMethodId });

        return NextResponse.json({
            success: true,
            message: 'Payment method removed successfully!'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}