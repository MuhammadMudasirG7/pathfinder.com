import mongoose from 'mongoose';

const PaymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    stripeCustomerId: {
        type: String,
        required: true
    },
    stripePaymentMethodId: {
        type: String,
        required: true,
        unique: true
    },
    cardBrand: {
        type: String, // e.g., 'visa', 'mastercard'
        required: true
    },
    cardLast4: {
        type: String, // e.g., '4242'
        required: true
    },
    expiryMonth: {
        type: Number,
        required: true
    },
    expiryYear: {
        type: Number,
        required: true
    },
    cardholderName: {
        type: String,
        default: ''
    },
    billingCountry: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'default'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', PaymentMethodSchema);