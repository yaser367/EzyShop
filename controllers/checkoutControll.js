const productSchema = require('../models/productSchema')
const categories = require("../models/categorySchema");
const User = require("../models/userSchema");
const Cart = require('../models/cartSchema')
const mongoose = require('mongoose');
const Checkout = require('../models/checkoutSchema')
const Wishlist = require('../models/wishlistSchema')

const Razorpay = require('razorpay');
let instance = new Razorpay({
  key_id: 'rzp_test_GEhcxU3Pqyg882',
  key_secret: '9kqzfV7hAR3kOPE0OJ7uvAEH',
});

const showCheckout = async(req,res)=>{
    try {
      const user_details = await User.findOne({ _id: req.session.isAuth });
      const id = req.session.isAuth
      const cate = await categories.find()
      const user = req.session.isAuth
      const cartdetails = await Cart.findOne({ userId:id }).populate({
        path: "userId",
        path: "cartItems",
        populate: { path: "productId" },
      });
    
      const cart = cartdetails.cartItems
      const discount = parseInt(cartdetails.discount)

      let total;
      let subtotal =0;
      for(values of cart){
        
        total = parseInt(values.quantity)*parseInt(values.productId.price)
        subtotal +=total
    }
    const totalAmount = subtotal-discount

      const address = user_details.address
      const carts = cartdetails.cartItems.slice(0,2)
      const wish = await Wishlist.findOne({ userId:user }).populate({
      path: "userId",
      path: "wishItems",
      populate: { path: "productId" },
    });

    const wishlist = wish.wishItems
      
      res.render('checkoutPage',{cate,user_details,user,cart,address,total,subtotal,discount,totalAmount,carts,wishlist})
  
    } catch (error) {
        console.log(error)  
    }
}
const postCheckout = async(req,res)=>{
  try {
    const {dis} = req.body
    const discount = parseInt(dis)
    await Cart.updateOne({userId:req.session.isAuth},{$set:{discount:discount}})
  } catch (error) {
    console.log(error)
  }
}



const orderPlacing = async(req,res)=>{
  try {
    const userId = req.session.isAuth;
    const {address,Payment} = req.body
    const cartdetails = await Cart.findOne({ userId:userId }).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
  
    const cart = cartdetails.cartItems
    const discount = parseInt(cartdetails.discount)
    let total;
    let subtotal =0;
    for(values of cart){
      
      total = parseInt(values.quantity)*parseInt(values.productId.price)
      subtotal +=total
  }
  const totalAmount = subtotal-discount

    // const newaddress = new mongoose.Types.ObjectId(address)
    // const userAddress = await User.aggregate([{$match: {
    //   _id:userId
    // }}, {$unwind: {
    //   path: "$address",
    // }}, {$match: {
    //   "address._id": newaddress
    // }}])


    const order = new Checkout({
      userId:userId,
      cartItems:cart,
      address:address,
      paymentStatus:Payment,
      total_price:totalAmount,
      discount:discount
      
    })
    await order.save()
    .then((order)=>{
      
      if(order.paymentStatus === "COD"){
        res.send({codPayment:true,order})

      }else{
        const orderId = order._id.toString()
        const amount = order.total_price
        
        var options = {  
          amount:amount*100,  // amount in the smallest currency unit
          currency: "INR",
          receipt: orderId.toString()
        };
        instance.orders.create(options, function(err, order) {
          if(err){
            console.log(err)
          }else{
          res.send(order)
          
          }
        
        });

        
      }
    })

    


  } catch (error) {
    console.log(error)
  }
} 

const orderSuccess = async(req,res)=>{
  try {
    const id =req.params
    const orderId = mongoose.Types.ObjectId(id)
    const order = await Checkout.findOne({_id:orderId}).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const cart1 = order.cartItems
    const user_details = await User.findOne({ _id: req.session.isAuth });
    const userId = req.session.isAuth
    const cate = await categories.find()
    const user = req.session.isAuth

    const cartdetails = await Cart.findOne({ userId:userId }).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
  
    const cart = cartdetails.cartItems
    const discount = parseInt(cartdetails.discount)
    const carts = cartdetails.cartItems.slice(0,2)
    const wish = await Wishlist.findOne({ userId:user }).populate({
      path: "userId",
      path: "wishItems",
      populate: { path: "productId" },
    });

    const wishlist = wish.wishItems
    res.render('successOrder',{user_details,cate,user,cart,cart1,order,discount,carts,wishlist})
  } catch (error) {
    console.log(error)
  }
}

const verifyPayment = async(req,res)=>{
  try {
    const orderId = req.body['order[receipt]']
    const neworderId = new mongoose.Types.ObjectId(orderId)
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256' , '9kqzfV7hAR3kOPE0OJ7uvAEH');
    hmac.update(req.body['payment[razorpay_order_id]']+'|'+req.body['payment[razorpay_payment_id]'])
    hmac = hmac.digest('hex')
    if(hmac == req.body['payment[razorpay_signature]']){
      await Checkout.updateOne({_id:neworderId},{$set:{is_complited:true}})
      res.send({success:true,orderId})
    }else{
      await Checkout.updateOne({_id:neworderId},{$set:{orderStatus:"cancelled"}})
    }

  } catch (error) {
    console.log(error)
  }
}

const showOrders = async(req,res)=>{
  try {
    const user_details = await User.findOne({ _id: req.session.isAuth });
    const user = req.session.isAuth
    const cate = await categories.find()
    const cartdetails = await Cart.findOne({ userId:user }).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const order = await Checkout.find({userId:user}).sort({createdAt:-1})
    const cart = cartdetails.cartItems
    
    const carts = cartdetails.cartItems.slice(0,2)
  const wish = await Wishlist.findOne({ userId:user }).populate({
      path: "userId",
      path: "wishItems",
      populate: { path: "productId" },
    });

    const wishlist = wish.wishItems


    res.render('showOrders',{user_details,cart,user,cate,order,carts,wishlist})
  } catch (error) {
    console.log(error)
  }
}

const cancelOrder = async(req,res)=>{
  try {
    const orderI = req.params
    const orderId = mongoose.Types.ObjectId(orderI)
    await Checkout.updateOne({_id:orderId},{$set:{orderStatus:"cancelled",is_complited:false}})
    res.send({success:true})
    
   
  } catch (error) {
    console.log(error)
  }
}

const getOrderId = async(req,res)=>{
  try {
    const orderID = req.params
    const id = mongoose.Types.ObjectId(orderID)
    const order1 = await Checkout.findOne({_id:id}).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const carts = order1.cartItems
    res.send({carts})

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
    showCheckout,
    orderPlacing,
    orderSuccess,
    verifyPayment,
    showOrders,
    cancelOrder,
    getOrderId,
    postCheckout


}