import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    date: { type: String, required: true },
    usersCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model("Role", roleSchema);