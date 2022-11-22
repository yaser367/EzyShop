const mongoose = require('mongoose')

const brandSchema = mongoose.Schema({
    brandName:{
        type:String,
        require:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Brand",brandSchema)