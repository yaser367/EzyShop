const mongoose = require('mongoose')

const checkoutSchema = mongoose.Schema({
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
            }         
        }
    ],
    address:{
        type:String,
        require:true
    },
    paymentStatus:{
        type:String,
        enum:["COD","Online_Payment"],
        require:true
    },
    total_price:{
        type:Number,
        require:true
    },
    orderStatus:{
        type:String,
        enum:["ordered","packed","shipped","delivered","cancelled"],
        default:"ordered"
        },   
    
    is_complited:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now()
    },
    discount:{
        type:String,
        default:0
    },
    expectedDate:{
        type:Date,
        default:()=>new Date(new Date() + 7*24*60*1000)
        
    }
        
    
}, { timestamps: true })

module.exports = mongoose.model("Checkout",checkoutSchema)