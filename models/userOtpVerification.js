
const mongoose = require("mongoose");


const userOtpVerificationSchema = mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
})






module.exports = mongoose.model('userOtpVerification',userOtpVerificationSchema)