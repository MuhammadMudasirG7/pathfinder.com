import mongoose from 'mongoose'

const GoogleCalendarConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    default: 'google',
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

export default mongoose.models.GoogleCalendarConnection || mongoose.model('GoogleCalendarConnection', GoogleCalendarConnectionSchema)