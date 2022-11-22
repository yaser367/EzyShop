const User = require("../models/userSchema");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userOtpVerifications = require("../models/userOtpVerification");
// const {validSchema} = require('../models/validationSchema')
const joiErrorFormatter= require('../utils/validationFormatter');
const { getgid } = require("process");
const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
const productSchema = require('../models/productSchema')
const categories = require("../models/categorySchema");
const Cart = require('../models/cartSchema')
const Banner = require('../models/bannerSchema')
const Wishlist = require('../models/wishlistSchema')

//get user home page
const getUserHomePage = async(req,res)=>{
  try {
   
    const user_details = await User.findOne({ _id: req.session.isAuth });
    const category = await categories.find()
    const product = await productSchema.find().populate({path:'category brand'})
    const user = req.session.isAuth
    const banner1 = await Banner.findOne({bannerName:"bannerOne"}).populate("productId")
    const banner2 = await Banner.findOne({bannerName:"bannerTwo"}).populate("productId")
    const banner3 = await Banner.findOne({bannerName:"bannerThree"}).populate("productId")
    const banner4 = await Banner.findOne({bannerName:"bannerFour"}).populate("productId")
    const newProduct = await productSchema.find({}).sort({createdAt:1}).limit(8).populate("category brand")
    if(req.session.isAuth){
      const id = req.session.isAuth
      const cartdetails = await Cart.findOne({ userId:id }).populate({
        path: "userId",
        path: "cartItems",
        populate: { path: "productId" },
      });
      const cart = cartdetails.cartItems
      const cartdetail = await Cart.findOne({ userId:id }).populate({
        path: "userId",
        path: "cartItems",
        populate: { path: "productId" },
      })
      const carts = cartdetail.cartItems.slice(0,2)
      const wish = await Wishlist.findOne({ userId:id }).populate({
        path: "userId",
        path: "wishItems",
        populate: { path: "productId" },
      });

      const wishlist = wish.wishItems
      res.render('users/index',{product,user,user_details,category,banner1,banner2,banner3,banner4,newProduct,cart,carts,wishlist})
    }
    else{
      res.render('users/index',{product,user,user_details,category,banner1,banner2,banner3,banner4,newProduct})

    }
    
    
  } catch (error) {
    console.log(error)
  }
}

// get home page

const getUserHome = async (req, res) => {
  try {
    await 
    res.render("home", { title: "home" });
  } catch (error) {
    console.log(error);
  }
};
// get Login page

const getUserLogin = async (req, res) => {
  try {
    res.render("login", { title: "login" });
  } catch (error) {
    console.log(error);
  }
};

// post Login page

const postUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("err", "incorrect email");
      return res.redirect("/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("err", "incorrect password");
      return res.redirect("/login");
    }
    if (user.is_verified == false) {
      req.flash("err", "please verify your mail");
      return res.redirect("/login");
    }
    req.session.isAuth = user._id
    if (user.is_admin == false) {
      res.redirect("/homePage");
    }
  } catch (error) {
    console.log(error);
  }
};

// user logout

const userLogout = async (req, res) => {
  try {
    delete req.session.isAuth;

    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};
// get user register

const getUserRegister = async (req, res) => {
  try {
    res.render("registration", { title: "register" });
  } catch (error) {
    console.log(error);
  }
};

//create nodemailer transport

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: config.smtpemail,
    pass: config.smtppassword,
  },
});

// post user register

const postUserRegister = async (req, res) => {
  try {
    // const validResult = validSchema.validate(req.body, {
    //   abortEarly: false,
    // });

    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { name, email, password, mobile,conformPassword } = req.body;
    if(name.length < 4 || name.length > 15){
      req.flash('err','Enter name between 4 -15 letters')
      return res.redirect('back')
    }else if (!email.match(regx)){
      req.flash('err','Enter a valid email')
      return res.redirect('back')
    }else if (mobile.length != 10 || isNaN(mobile)) {
      req.flash('err','enter a valid mobile number')
      return res.redirect('back')
    }else if (password.length < 4 || password.length > 15){
      req.flash('err','Enter password between 4 -15 letters')
      return res.redirect('back')
    }else if(password != conformPassword){
      req.flash('err','Password not match')
      return res.redirect('back')

    }
    else{
      let user = await User.findOne({ email });
      if (user) {
        req.flash("err", "email already exist");
        return res.redirect("/register");
      }
      const hashPass = await bcrypt.hash(password, 12);
      user = new User({
        name,
        email,
        password: hashPass,
        mobile,
        is_admin: false,
        is_verified: false,
        is_active:true
      });
      user
        .save()
        .then((result) => {
          sendOtpVerificationMail(result, req, res);
        })
        .catch((error) => {
          console.log(error);
        });
    }


   
  } catch (error) {
    console.log(error.message);
    req.flash("err",error.message);
    res.redirect('back')
    
  }
};


//get verify otp

const getVerifyOtp = async (req, res) => {
  try {
    res.render('verifymail',{title:"verify",emailId:{_id:req.body._id,hashedOtp:req.body.hashedOtp}})
  } catch (error) {
    console.log(error);
  }
};

const sendOtpVerificationMail = async ({_id,email},req,res)=>{
    try {
      const id = _id.toString()
      console.log(id)
        const otp = `${Math.floor(1000 + Math.random() *9000)}`;

        //mail option 

        const mailOptions = {
            from:'yasermuhammed367@gmail.com',
            to:email,
            subject:"verify your email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address </p>
            <p>this code <b> expires in one hour</b>.</p>`
        }
     //hash otp 
     
     const hashedOtp = await bcrypt.hash(otp,10);
     const newOtpVerification =  new userOtpVerifications({
            userId: _id,
            otp:hashedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now()+600000,
     })
     await newOtpVerification.save(); 

     await transporter.sendMail(mailOptions)
     console.log('email has been sent');
     res.render('verifymail',{emailId:_id,email,hashedOtp,title:'veriflying',})
     req.flash('success','successfully Registered,please verify your mail.')   
     
     
    } catch (error) {
        console.log(error);
    }
}
// post verify otp

const postVerifyOtp = async(req,res)=>{
    try {
        const {userId,otp,hashedOtp} = req.body;
      console.log(req.body)
        // console.log("otp"+otp+" userId"+userId)
        if(!userId || !otp){
            
            res.redirect('/verifyotp')
            req.flash('err','emty field is not allowed')
           
        }else{
          // const user = userId.toString()
            // const newuserId= mongoose.Types.ObjectId(user)
            // console.log(user)
            console.log(userId)
            console.log("first")
          const userVerRecord = await userOtpVerifications.find({userId:userId})
          console.log(userVerRecord)
            
        if(userVerRecord.length <= 0){
            req.flash('err','Account record doesn\'t exist or has been verified already')
            res.redirect('/verifyotp')
        }else{
            const {expiresAt} = userVerRecord[0]
            const hashedOtp = userVerRecord[0].otp
            
        
        if(expiresAt < Date.now()){
            await userOtpVerifications.deleteMany({userId})
            req.flash('err','code has been expired,please send again')
            res.redirect('/register')
        }else{
            const validOtp = await bcrypt.compare(otp,hashedOtp)
            if(!validOtp){
                req.flash('err','invalid otp,please check again')
                res.redirect('/verifyotp')
            }else{
               await User.updateOne({_id: userId},{is_verified:true})
            await userOtpVerifications.deleteMany({userId})

                res.redirect('/login')
                req.flash('success','Otp verified')
            }
        }
      }
    }
    } catch (error) {
        console.log(error);
    }
}

const userProfile = async(req,res)=>{
  try {
    const user_details = await User.findOne({ _id: req.session.isAuth }); 
    const address  = user_details.address
    const id = req.query.id
    const user = await User.findById(id)
    const cate = await categories.find()
    const cartdetails = await Cart.findOne({ userId:id }).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const cart = cartdetails.cartItems
    const cartdetail = await Cart.findOne({ userId:id }).populate({
      path: "userId",
      path: "cartItems",
      populate: { path: "productId" },
    });
    const carts = cartdetail.cartItems.slice(0,2)
  const wish = await Wishlist.findOne({ userId:id }).populate({
      path: "userId",
      path: "wishItems",
      populate: { path: "productId" },
    });

    const wishlist = wish.wishItems
    res.render('users/profile',{user_details,cate,user,address,cart,carts,wishlist})
  } catch (error) {
    console.log(error)
  }
}

const addAddress = async(req,res)=>{
  try {
    const id = req.query.id
    const user = req.session.isAuth
    const cate = await categories.find()
    const user_details = await User.findOne({ _id: req.session.isAuth });
    const cartdetails = await Cart.findOne({ userId:user }).populate({
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
    
    res.render('users/addAddress',{user_details,cate,cart,carts,wishlist,user})
  } catch (error) {
    console.log(error)
  }
}

const postAddAddress = async(req,res)=>{
  try {
    const userId = req.session.isAuth
   let success;
    
   if(userId){
    const {firstName,surName,phone,address,postCode,area,emailId,country,state} = req.body
    if(!firstName,!surName,!phone,!address,!postCode,!area,!emailId,!country,!state){
      res.send({success:false})
    }else{
      await User.updateOne({_id:userId},{$push:{address:{
        fistName:req.body.firstName,
        surName:req.body.surName,
        phone:req.body.phone,
        address:req.body.address,
        postCode:req.body.postCode,
        area:req.body.area,
        emailId:req.body.emailId,
        country:req.body.country,
        state:req.body.state
  
      }}})
      res.send({success:true})
    }
   
   }

  } catch (error) {
    console.log(error)
  }
}

const deleteAddress = async(req,res)=>{
  try {
    const id = req.params
    const addressId = mongoose.Types.ObjectId(id)
    res.send({success:true})
    await User.updateOne({_id:req.session.isAuth},{$pull:{address:{_id:addressId}}})
  } catch (error) {
    console.log(error)
  }
}

const seachProduct =async(req,res)=>{
  try {
    let payload = req.body.payload.trim()
    let search = await productSchema.find({productName:{$regex:new RegExp('^'+payload+'.*','i')}}).exec()
    search = search.slice(0,6)
    res.send({payload:search})
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUserHome,
  getUserLogin,
  postUserLogin,
  userLogout,
  getUserRegister,
  postUserRegister,
  getVerifyOtp,
  postVerifyOtp,
  getUserHomePage,
  userProfile,
  addAddress,
  postAddAddress,
  deleteAddress,
  seachProduct  
};
