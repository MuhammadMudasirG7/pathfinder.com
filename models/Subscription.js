import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  accountId: { type: String, required: true, unique: true },
  currentPlan: { 
    type: String, 
    enum: ['Starter', 'Growth', 'Professional'], 
    default: 'Starter' 
  },
  activationDate: { type: Date, default: Date.now },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String},
  activeUsersCount: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);