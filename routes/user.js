const express = require("express");
const router = express();
const path = require("path");
const userController = require('../controllers/userController')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views"));


const Auth = require('../middlewares/usermid')
//user Authentification
router.get('/homePage',userController.getUserHomePage)

router.get("/login",Auth.isLogin,userController.getUserLogin);
router.post('/login',userController.postUserLogin)
router.post('/logout',userController.userLogout)
router.get("/register",Auth.isLogin,userController.getUserRegister);
router.post('/register',userController.postUserRegister)
router.get('/verifyotp',Auth.isLogin,userController.getVerifyOtp)
router.post('/verifyotp',userController.postVerifyOtp)
router.get('/profile',Auth.isAuth,userController.userProfile)
router.get('/address',Auth.isAuth,userController.addAddress)
router.post('/address/add',Auth.isAuth,userController.postAddAddress)
router.delete('/address/delete/:id',userController.deleteAddress)
router.post('/searchProducts',userController.seachProduct)

module.exports = router;
