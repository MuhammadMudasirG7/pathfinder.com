import mongoose from "mongoose";

const SecuritySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    recoveryCodes:{
        type:[String],
        default:[]
    },
    newDeviceVerification:{
        type:Boolean,
        default:false
    },
    twoStepVerification:{
        type:Boolean,
        default:false
    },
    phoneNumber:{
        type:String,
        default:""
    },
    alternateEmails : {
        type:[String],
        default:[]
    },
    authenticator : {
        type:Boolean,
        default:false
    },
    signInAlert: {
        type:Boolean,
        default:false
    },
    thirdPartyAccess:{
        type:Boolean,
        default:true
    },
    newsLetter : {
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.models.Security || mongoose.model("Security",SecuritySchema)