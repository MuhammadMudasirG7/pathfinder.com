import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    doNotDisturb: {
        enabled: {
            type: Boolean,
            default: true
        },

        fromTime: {
            type: String,
            default: "08:00 PM"
        },

        toTime: {
            type: String,
            default: "05:00 PM"
        }
    },

    daysOff: {
        type: [String],
        default: []
    },

    emailNotifications: {
        type: Array,
        default: [
            {
                id: "jobPosted",
                label: "Receive emails when a new job is posted in a team you are a member of.",
                checked: false
            },
            {
                id: "newApplicant",
                label: "Receive emails when you get a new applicant for a job within a team you are a member of.",
                checked: false
            },
            {
                id: "mentioned",
                label: "Receive emails when you are mentioned by a team member in a note.",
                checked: true
            },
            {
                id: "addNote",
                label: "Receive emails when a team member adds a note.",
                checked: false
            },
            {
                id: "addedTeam",
                label: "Receive emails when you are added to a new team.",
                checked: false
            },
            {
                id: "eventBooked",
                label: "Receive emails when a candidate books an event slot for an event you are attending.",
                checked: true
            },
            {
                id: "reminder",
                label: "Receive email reminders for upcoming events you are attending.",
                checked: false
            },
            {
                id: "accepted",
                label: "Receive emails when an event you are attending is accepted by a candidate.",
                checked: false
            },
            {
                id: "declined",
                label: "Receive emails when an event you are attending is declined by a candidate.",
                checked: false
            },
            {
                id: "updated",
                label: "Receive emails when an event is updated.",
                checked: false
            },
            {
                id: "deleted",
                label: "Receive emails when an event you are attending is deleted.",
                checked: false
            },
            {
                id: "activated",
                label: "Receive emails when an event you are attending is activated.",
                checked: false
            },
            {
                id: "offerAcepted",
                label: "Receive emails when an offer is accepted by a candidate within a team you are a member of.",
                checked: false
            },
            {
                id: "offerDeclined",
                label: "Receive emails when an offer is declined by a candidate within a team you are a member of.",
                checked: false
            }
        ]
    }

}, { timestamps: true })

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)