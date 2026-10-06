import mongoose from 'mongoose';

const MeetingIntegrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: String,
    enum: ['google_meet', 'teams', 'zoom'],
    required: true,
  },
  email: {
    type: String,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: '',
  },
  connected: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });
MeetingIntegrationSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.models.MeetingIntegration || mongoose.model('MeetingIntegration', MeetingIntegrationSchema);