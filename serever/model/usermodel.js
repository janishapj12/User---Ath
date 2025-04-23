import mongoose from "mongoose";
 const userShema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    verifyotp:{
        type:String,
         default: "",
    },

    verifyotpExpireAt:{
        type:Number,
       default:0,
    },
    isAccountVerify:{
        type:Boolean,
       default: false,
    },
    resetotp:{
        type:String,
       default: '',

    },
    resetotpexpireAt:{
        type:Number,
        default:0,
    },
    
 })

 const userModel = mongoose.models.user ||  mongoose.model('user',userShema)

export default userModel;