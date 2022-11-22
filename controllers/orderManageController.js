const Checkout = require("../models/checkoutSchema")
const mongoose = require('mongoose');

const showOrderManage = async(req,res)=>{
    try {
        const order = await Checkout.find()
        res.render("orderManagement",{order})
    } catch (error) {
        console.log(error)
    }
}

const changeStatus = async(req,res)=>{
    try {
        const id = req.params
        const {sta} = req.body
        const orderId = mongoose.Types.ObjectId(id)
        const d = await Checkout.findOne({_id:orderId})
        await Checkout.updateOne({_id:orderId},{$set:{orderStatus:sta}})
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}

const viewOrder = async(req,res)=>{
    try {
    const orderID = req.params
    const id = mongoose.Types.ObjectId(orderID)
    const order1 = await Checkout.findOne({_id:id}).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const carts = order1.cartItems
    res.render("viewOrderedPro",{order1,carts})
        
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    showOrderManage,
    changeStatus,
    viewOrder
}