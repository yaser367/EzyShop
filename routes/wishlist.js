const express = require("express");
const router = express();
const wishlistController = require('../controllers/wishlistController')
const path = require('path')

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/users/wishlist"));

const Auth = require('../middlewares/usermid')

router.post('/add/:id',wishlistController.addToWishlist)
router.get('/show',Auth.isAuth,wishlistController.showWishlist)
router.post('/delete/:id',wishlistController.deleteWishlist)

module.exports = router;