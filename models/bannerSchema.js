const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    bannerName:{
        type:String,
        enum:["bannerOne","bannerTwo","bannerThree","bannerFour"]
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    offerName:{
        type:String,
    },
    heading:{
        type:String
    },
    offerPrice:{
        type:Number
    },
    discription:{
        type:String
    },
    image:{
        url:String,
        filename:String
    }
})

module.exports = mongoose.model("Banner",bannerSchema)