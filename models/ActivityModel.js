import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    sessionId:{
        type:String,
        required:true,
        unique:true,
    },
    device:{
        type:String,
        default:"Unknown"
    },
    location:{
        type:String,
        default:""
    },
    sessionStatus:{
        type:String,
        enum:["Active","Expired"],
        default:"Active"
    }
},{timestamps:true})

 export default mongoose.models.Activity || mongoose.model("Activity",ActivitySchema)