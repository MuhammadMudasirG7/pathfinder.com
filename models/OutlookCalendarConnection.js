import mongoose from 'mongoose'

const OutlookCalendarConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    default: 'outlook',
  },
  email: {
    type: String,
    required: true,
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
}, { timestamps: true })

export default mongoose.models.OutlookCalendarConnection || mongoose.model('OutlookCalendarConnection', OutlookCalendarConnectionSchema)