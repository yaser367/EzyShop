const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        require:true,
        
    },
    couponName:{
        type:String,
        require:true
    },
    discount:{
        type:Number,
        require:true
    },
    expireDate:{
        type:Date,
        require:true
    },
    minimumPrice:{
        type:Number,
        require:true
    },
    maxmumPrice:{
        type:Number,
        require:true
    },
    isActive:{
        type:Boolean,
        require:true,
        default:true
    },
 
   
},{timestamps:true})

module.exports = mongoose.model("Coupon",couponSchema)