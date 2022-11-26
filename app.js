const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const methodOverride = require('method-override')
const config = require('./config/config')

const app = express();



if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

mongoose.connect(config.mongoUri)

.then((res)=>{
  console.log("mongodb connected")
})

app.use(express.static(path.join(__dirname, "assets")));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

const store = new mongoDbSession({
  uri:config.mongoUri,
  collection:'mySessions'
})
app.use(flash())

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(session({
  secret: 'this is secret',
  resave: false,
  saveUninitialized: false,
  store:store
}))


//flash.

app.use(require('connect-flash')());
app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  res.locals.err = req.flash('err')
  next()
})

const userRout = require("./routes/user");
const adminRout = require("./routes/admin");
const categoryRout = require("./routes/category")
const brandRout = require("./routes/brand")
// const subCategoryRout = require("./routes/subCategory")
const productRout = require("./routes/products")
const userProduct = require('./routes/userProduct')
const cartItems = require('./routes/cart')
const wishlist = require('./routes/wishlist')
const checkout =require('./routes/checkout')
const order = require('./routes/order')
const banner = require('./routes/banner')
const coupon = require('./routes/coupon')

app.use("/", userRout);
app.use("/admin", adminRout);
app.use("/admin/category",categoryRout);
app.use("/admin/brand",brandRout);
app.use("/admin/product",productRout);
app.use("/admin/order",order)
app.use("/admin/banner",banner)
app.use("/admin/coupon",coupon)
app.use("/product",userProduct)
app.use("/cartItems",cartItems)
app.use("/wishlist",wishlist)
app.use("/checkout",checkout)

app.get('*',(req,res)=>{
  res.render('users/404')
})


app.listen(3000, () => {

  console.log("listening");
});
