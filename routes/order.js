const express = require("express");
const router = express();
const orderController = require('../controllers/orderManageController')
const path = require('path');
const Auth = require('../middlewares/adminmid')

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/admin"));
router.get('/show',orderController.showOrderManage)
router.post('/changeStatus/:id',orderController.changeStatus)
router.get('/:id',orderController.viewOrder)


module.exports = router;
