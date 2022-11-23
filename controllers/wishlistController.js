const productSchema = require('../models/productSchema')
const categories = require("../models/categorySchema");
const User = require("../models/userSchema");
const Cart = require('../models/cartSchema')
const Wishlist = require('../models/wishlistSchema')
const mongoose = require('mongoose');


const addToWishlist = async(req,res)=>{
    try {
        if(req.session.isAuth){
            
            const prodId = req.params
            const productId = new mongoose.Types.ObjectId(prodId)
            const userId = req.session.isAuth
            const detail = await User.findOne({_id:userId})
            let success;
            let errors

            if(detail.is_active == true){
                const userExist = await Wishlist.findOne({ userId })
                if(userExist){
                    const productExist = await Wishlist.findOne({$and: [{userId},{wishItems: {$elemMatch: {
                        productId
                    }}}]})
                    if(productExist){
                        res.send({errors:"This Product Already added"})
                        
                    }else{
                        await Wishlist.updateOne({userId},{$push:{wishItems:{productId}}})
                        res.send({success:true})
                        
                    }
                    }else{
                    const wishlist = new Wishlist ({
                        userId,wishItems:[{productId}]
                    })
                    await wishlist.save()
                    .then(()=>{
                        res.send({success:true})
                        
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                } const wishlistCount = await Wishlist.aggregate([{$match: {userId}},{$project:{count:{$size:"$wishItems"}}}])
            } else {
                req.flash('error','You are unable to access the product')
                res.redirect('back')
            }
        }else {
            req.flash('error','You are not logged in')
            res.redirect('back')
        }
    } catch (error) {
        console.log(error)
    }
}

const showWishlist = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const id = req.query.id;
        let wishlist;
        let cart;
        let carts;
        const wish = await Wishlist.findOne({ userId:id }).populate({
          path: "userId",
          path: "wishItems",
          populate: { path: "productId" },
        });
        if(wish){
         wishlist = wish.wishItems
        }
        const cartdetails = await Cart.findOne({ userId:id }).populate({
            path: "userId",
            path: "cartItems",
            populate: { path: "productId" },
          });
          if(cartdetails){
        cart = cartdetails.cartItems
          }
        const user_details = await User.findOne({ _id: req.session.isAuth });
        const cate = await categories.find()
        const cartdetail = await Cart.findOne({ userId:id }).populate({
            path: "userId",
            path: "cartItems",
            populate: { path: "productId" },
          })
          if(cartdetail){
          carts = cartdetail.cartItems.slice(0,2)

          }
        res.render('showWishlist',{user,wishlist,cate,user_details,cart,carts})
    } catch (error) {
        console.log(error)
    }
}

const deleteWishlist = async (req,res)=>{
    try {
        const id = req.params
        const productId = mongoose.Types.ObjectId(id)
        const userId = req.session.isAuth
        const user_details = await User.findById({_id:userId})
        if(user_details.is_active == true){
            await Wishlist.updateOne({userId},{$pull:{wishItems:{"productId":productId}}})
            res.send({success:true})
        }else{
            res.redirect('back')
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addToWishlist,
    showWishlist,
    deleteWishlist
  };