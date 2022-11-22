const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    wishItems:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                require:true
            }
        
        }
    ]
        
    
}, { timestamps: true })

module.exports = mongoose.model("Wishlist",wishlistSchema)