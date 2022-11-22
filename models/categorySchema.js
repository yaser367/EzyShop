const { boolean } = require('joi')
const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category:{
        type:String,
        require:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    }
})


module.exports = mongoose.model("Category",categorySchema)