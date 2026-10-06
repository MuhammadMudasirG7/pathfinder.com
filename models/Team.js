import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    job: {
        type: String,
        default: "Not Available"
    },

    initials: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Administrator", "Member"],
        default: "Member"
    },

    status: {
        type: String,
        default: "Active"
    }
});

const teamSchema = new mongoose.Schema({
    // Team kis logged-in user ki hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    subtitle: {
        type: String,
        default: ""
    },

    isOpen: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        default: "Active"
    },

    stats: {
        members: { type: Number, default: 0 },
        openJobs: { type: Number, default: 0 },
        closedJobs: { type: Number, default: 0 },
        archivedJobs: { type: Number, default: 0 }
    },

    members: [memberSchema]

}, { timestamps: true });

export default mongoose.models.Team ||
    mongoose.model("Team", teamSchema);