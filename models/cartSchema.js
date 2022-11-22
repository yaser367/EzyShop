const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    cartItems:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                require:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:String,
                require:true
            }
           
        }
    ],
    discount:{
        type:Number,
        default:0
    }
        
    
}, { timestamps: true })

module.exports = mongoose.model("Cart",cartSchema)