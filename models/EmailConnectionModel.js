import mongoose from "mongoose";

const EmailConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    provider: {
      type: String,
      enum: ["google", "microsoft"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      default: "",
    },

    connected: {
      type: Boolean,
      default: true,
    },

    autoSync: {
      type: Boolean,
      default: true,
    },

    syncInterval: {
      type: Number,
      default: 120,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmailConnection ||
  mongoose.model("EmailConnection", EmailConnectionSchema);