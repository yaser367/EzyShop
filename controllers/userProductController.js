const productSchema = require('../models/productSchema')
const categerySchema = require('../models/categorySchema')
const User = require('../models/userSchema')
const Cart = require('../models/cartSchema')
const Wishlist = require('../models/wishlistSchema')

const viewProductByCat = async(req,res)=>{
    try {
        const category_data = await categerySchema.find()
        const cate = await categerySchema.find()
        const id = req.query.id;
        const category = await categerySchema.find({_id:id})
        const product = await productSchema.find({category:category}).populate("category brand")
        const allProducts = await productSchema.find().populate("category brand")
        const user = req.session.isAuth
        const user_details = await User.findOne({ _id: req.session.isAuth });
        if(req.session.isAuth){
            const id = req.session.isAuth
            const cartdetails = await Cart.findOne({ userId:id }).populate({
              path: "userId",
              path: "cartItems",
              populate: { path: "productId" },
            });
            const cart = cartdetails.cartItems
        
              const carts = cartdetails.cartItems.slice(0,2)
            const wish = await Wishlist.findOne({ userId:id }).populate({
                path: "userId",
                path: "wishItems",
                populate: { path: "productId" },
              });
        
              const wishlist = wish.wishItems
           
            res.render('allProducts',{product,allProducts,user,cate,category,category_data,user_details,cart,wishlist,carts})
          
          }else{
            res.render("allProducts",{product,allProducts,user,cate,category,category_data,user_details})
          }

        
    } catch (error) {
        console.log(error)
    }
}
const oneProduct = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const user_details = await User.findOne({ _id: req.session.isAuth });
       
        const id = req.query.id;
        const cate = await categerySchema.find()
        const product = await productSchema.find({_id:id}).populate("category brand") 
        if(req.session.isAuth){
            const id = req.session.isAuth
            const cartdetails = await Cart.findOne({ userId:id }).populate({
              path: "userId",
              path: "cartItems",
              populate: { path: "productId" },
            });
            const cart = cartdetails.cartItems
          
              const carts = cartdetails.cartItems.slice(0,2)
            const wish = await Wishlist.findOne({ userId:id }).populate({
                path: "userId",
                path: "wishItems",
                populate: { path: "productId" },
              });
        
              const wishlist = wish.wishItems
            res.render('productDetails',{product,cate,user,user_details,carts,wishlist,cart})
          }else{
            res.render('productDetails',{product,cate,user,user_details})

          }      
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    viewProductByCat,
    oneProduct
}