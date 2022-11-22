const express = require("express");
const router = express();
const path = require('path')
const Auth = require('../middlewares/adminmid')
const multer = require('multer')
const {storage} = require('../config/cloudinary')
const upload =multer({storage})
const productController = require('../controllers/productController')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/products"));

//admin
router.get('/add',productController.getAddProduct)
router.post('/add',upload.array('image'),productController.postAddProduct)
router.get('/showProduct',productController.showProducts)
router.get('/update',productController.getUpdateproduct)
router.put('/update/:id',upload.array('image',4),productController.updateProduct)
router.put('/block/:id',productController.blockProduct)
router.put('/unblock/:id',productController.unblockProduct) 

module.exports =router;

