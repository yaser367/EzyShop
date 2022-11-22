const express = require("express");
const router = express();
const checkoutController = require('../controllers/checkoutControll')
const path = require('path');
const Auth = require('../middlewares/usermid')

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/users/checkout"));

router.get('/show/:id',checkoutController.showCheckout)
router.post('/show',checkoutController.postCheckout)
router.post('/add',checkoutController.orderPlacing)
router.get('/success/:id',Auth.isAuth,checkoutController.orderSuccess)
router.post('/verifyPayment',checkoutController.verifyPayment)
router.get('/order',checkoutController.showOrders)
router.post('/cancel/:id',checkoutController.cancelOrder)
router.post('/:id',checkoutController.getOrderId)

module.exports = router;
