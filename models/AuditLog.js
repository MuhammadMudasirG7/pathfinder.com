import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar: {
        type: String,
        required: true // Jaise "PS" (Pankaj Singh ki initials)
    },
    text: {
        type: String,
        required: true // Action ki tafseel (e.g., "Pankaj Singh added a user S John")
    },
    date: {
        type: String,
        required: true // Formatted date string
    }
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);