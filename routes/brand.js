const express = require("express");
const router = express();
const brandController = require('../controllers/brandController')
const path = require('path')
const Auth = require('../middlewares/adminmid')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/brand"));

router.get('/add',Auth.isAdminAuth,brandController.getCreateBrand)
router.post('/add',brandController.postCreateBrand)
router.get('/show',Auth.isAdminAuth,brandController.getShowBrands)
router.delete('/delete/:id',brandController.deleteBrand)
router.put('/block/:id',brandController.blockBrand)
router.put('/unblock/:id',brandController.unblockBrand) 

module.exports = router;