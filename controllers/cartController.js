const productSchema = require('../models/productSchema')
const categories = require("../models/categorySchema");
const User = require("../models/userSchema");
const Cart = require('../models/cartSchema')
const mongoose = require('mongoose');
const Coupon = require('../models/couponSchema')
const Wishlist = require('../models/wishlistSchema')

const showCart = async(req,res)=>{
    try {
      const user = req.session.isAuth
      const id = req.query.id;
      const cartdetails = await Cart.findOne({ userId:id }).populate({
        path: "userId",
        path: "cartItems",
        populate: { path: "productId" },
      });
      const cart = cartdetails.cartItems
      const cartdetail = await Cart.findOne({ userId:user }).populate({
        path: "userId",
        path: "cartItems",
        populate: { path: "productId" },
      });
      const carts = cartdetail.cartItems.slice(0,2)
    const wish = await Wishlist.findOne({ userId:user }).populate({
        path: "userId",
        path: "wishItems",
        populate: { path: "productId" },
      });

      const wishlist = wish.wishItems
      let total;
      let subtotal =0;
      for(values of cart){
        
        total = parseInt(values.quantity)*parseInt(values.productId.price)
        subtotal +=total
    }

      const user_details = await User.findOne({ _id: req.session.isAuth });
      const cate = await categories.find()
      const coupons = await Coupon.find({isActive:true})
      res.render('cartItems',{user_details,cate,cart,cartdetails,subtotal,total,user,coupons,carts,wishlist})
    } catch (error) {
      console.log(error)
    }
  }
const addToCart = async(req,res)=>{
  try {
    
    if(req.session.isAuth){
    const prodId = req.params

    const productId = new mongoose.Types.ObjectId(prodId)
  
    const userId = req.session.isAuth
    const item = await productSchema.findOne({_id: productId})
    const price = item.price
    const detail = await User.findById({_id:userId})
    let success;
    if(detail.is_active == true) {
    const userExist = await Cart.findOne({ userId })


    if (userExist) {
        const productExist = await Cart.findOne({$and: [{userId},{cartItems: {$elemMatch: {
            productId
        }}}]})

        if(productExist) {
            await Cart.findOneAndUpdate({$and: [{userId},{"cartItems.productId":productId}]}, {$inc:{"cartItems.$.quantity":1}})
            res.send({added:true})    
            
        } else {
            await Cart.updateOne({userId},{$push: {cartItems:{productId,quantity:1,price}}})
            res.send({success:true})
                 
        }
    } else {
        const cart = new Cart ({
            userId,cartItems: [{productId,quantity:1,price}]

        })
        await cart.save()
        .then(() => {
            res.send({success:true})

        })
        .catch((err) =>{
            console.log(err)
        })
    }
    const cartCount = await Cart.aggregate([{$match: {userId}},{$project:{count:{$size:"$cartItems"}}}])
} else {
    req.flash('error','You are unable to access the product')
    res.redirect('back')
}
} else {
    req.flash('error','You are not logged in')
    res.redirect('back')
}
} catch(err) {
    console.log(err)
}
}

const incCartItems = async(req,res)=>{
    try {
       const id =req.params     
       const productId = mongoose.Types.ObjectId(id)
       const userId = req.session.isAuth;
       const user_details = await User.findById({_id:userId})
        if(user_details.is_active == true){
            const userExist = await Cart.findOne({userId})
            if(userExist){
                const productExist = await Cart.findOne({$and:[{userId},{cartItems:{$elemMatch:{
                    productId
                }}}]})
                if(productExist){
                    await Cart.findOneAndUpdate({$and:[{userId},{"cartItems.productId":productId}]},{$inc:{"cartItems.$.quantity":1}})                  
                    
                    req.flash('success','item added to cart')
                    res.send({success:true})
                }
                else{
                    req.flash('err','unable to add item')
                    res.redirect('back')
                }
            }else{
                req.flash('err','you are not logged in ')
            }
            const cartCount = await Cart.aggregate([{$match: {userId}},{$project:{count:{$size:"$cartItems"}}}])
        }else{
            req.flash('err','you are not able to access product')
            res.redirect('back')
        }


    } catch (error) {
        console.log(error)
    }
}

const decCartItem = async (req,res)=>{
    try {
        const id = req.params;
        const productId = mongoose.Types.ObjectId(id)
        const userId = req.session.isAuth;
        const user_details = await User.findById({_id:userId})

        if(user_details.is_active == true){
            const userExist = await Cart.findOne({userId})
            if(userExist){
                const productExist = productSchema.findOne({$and:[{userId},{cartItems:{$elemMatch:{productId}}}]})
                if(productExist){
                await Cart.findOneAndUpdate({$and: [{userId},{"cartItems.productId":productId}]}, {$inc:{"cartItems.$.quantity":-1}})
               
                res.send({success:true})
                }else{
                    req.flash('err','unable to remove item')
                    
                }
            }else{
                req.flash('err','you are not logged in')
                
            }const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:'cartItems'}}}])
        }
        
        else {
            req.flash('error','You are unable to access the product')
            
        }
        
    } catch (error) {
        console.log(error)
    }
}

const deleteCartItem = async(req,res)=>{
    try {
        const id = req.params
        const productId = mongoose.Types.ObjectId(id)
        const userId = req.session.isAuth
        const user_details = await User.findById({_id:userId})

        if(user_details.is_active == true){
           await Cart.updateOne({userId},{$pull:{cartItems:{"productId":productId}}})
            res.send({success:true})
        }else{
            
        }
    } catch (error) {
        console.log(error)
    }
}
const applyCoupon = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const {code,disc} = req.body
        const couponExist = await Coupon.findOne({couponCode:code})
        
        const cartdetails = await Cart.findOne({ userId:user }).populate({
            path: "userId",
            path: "cartItems",
            populate: { path: "productId" },
          });
          const cart = cartdetails.cartItems
          let total;
          let subtotal = 0;
          for(values of cart){
            
            total = parseInt(values.quantity)*parseInt(values.productId.price)
            subtotal +=total
       
        if(!couponExist){
        res.send({success:false})
        
        }else{
            if(couponExist.isActive === false){
                res.send({success:false})
            }else{
                if(couponExist.createdAt > Date.now()){
                    res.send({expired:true})
                    await Coupon.updateOne({couponCode:code},{$set:{isActive:false}})
                }
                }
                if(couponExist.minimumPrice > subtotal){
                    res.send({minimum:false})
                }else{
                    if(couponExist.maxmumPrice < subtotal){
                        const maxDiscount = parseInt(couponExist.maxmumPrice)*parseInt(couponExist.discount)/100
                        res.send({max:true,couponExist,maxDiscount})
                    }else{
                        const maxDiscount = parseInt(couponExist.maxmumPrice)*parseInt(couponExist.discount)/100
                        const discount = subtotal*parseInt(couponExist.discount)/100
                        res.send({success:true,couponExist,discount,maxDiscount,subtotal})
                    }
                }
            
            }
        }
        
        
    } catch (error) {
        console.log(error)
    }
}

  module.exports = {
    showCart,
    addToCart,
    incCartItems,
    decCartItem,
    deleteCartItem,
    applyCoupon
  };