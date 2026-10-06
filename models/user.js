import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },

        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Work Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        timeZone: {
            type: String,
            default: '(UTC+05:00) Pakistan',
        },

        accountType: {
            type: String,
            required: [true, 'Account type is required'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
        },

        termsAgreed: {
            type: Boolean,
            default: true,
        },
        jobTitle: {
            type: String,
            default: '',
            trim: true,
        },

        city: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'expired', 'disabled'],
            default: 'pending',
        },
        state: {
            type: String,
            default: '',
            trim: true,
        },

        country: {
            type: String,
            default: '',
            trim: true,
        },
        team: {
            type: String,
            enum: ["Sales"],
            default: "Sales"
        },
        currency: {
            type: String,
            default: '',
            trim: true,
        },
        companyWebsite: {
            type: String,
            default: '',
            trim: true,
        },
        accountId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        profileImage: {
            type: String,
            default: ""
        },
        companyImage: {
            type: String,
            default: ""
        },
        systemRoles: {
            type: String,
            enum: ["Super Admin", "Admin", "Standard User", "Collaborator"]
        },
        customRoles: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            default: "Standard User"
        },
        resetOtp: {
            type: String,
            default: null
        },

        resetOtpExpire: {
            type: Date,
            default: null
        },

        otpVerified: {
            type: Boolean,
            default: false
        },
        hasGeneratedCodes: {
            type: Boolean,
            default: false
        },
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);