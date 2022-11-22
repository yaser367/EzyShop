const express = require("express");
const router = express();
const couponController = require('../controllers/couponController')
const path = require('path');
const Auth = require('../middlewares/adminmid')

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/admin"));

router.get('/show',couponController.showCouponManage)
router.get('/add',couponController.addCoupon)
router.post('/add',couponController.postAddCoupon)
router.put('/change/:id',couponController.changeStatus)

module.exports = router;
