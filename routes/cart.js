const express = require("express");
const router = express();
const cartController = require('../controllers/cartController')
const path = require('path')
const Auth = require('../middlewares/usermid')

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/users/cart"));

router.post('/add/:id',cartController.addToCart)
router.get('/show',Auth.isAuth,cartController.showCart)
router.post('/incItem/:id',cartController.incCartItems)
router.post('/decItem/:id',cartController.decCartItem)
router.post('/delete/:id',cartController.deleteCartItem)
router.post('/apply/coupon',cartController.applyCoupon)


module.exports = router;





