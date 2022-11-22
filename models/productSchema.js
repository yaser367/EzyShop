const { boolean } = require('joi')
const mongoose = require('mongoose')

const productShema = mongoose.Schema({
    productName:{
        type:String,
        require:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Brand"
    },
    price:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    images:[{
        url:String,
        filename:String
    }],
    specifications:{
        type:String,
        require:true
    },
    is_blocked:{
        type: Boolean,
        require: true,
    }

},{timestamps:true})

module.exports = mongoose.model("Product",productShema)