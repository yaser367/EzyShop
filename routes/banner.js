const express = require("express");
const router = express();
const bannerController = require('../controllers/bannerController')
const path = require('path')
const Auth = require('../middlewares/adminmid')
const multer = require('multer')
const {storage} = require('../config/cloudinary')
const upload =multer({storage})


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/admin"));

router.get('/show',Auth.isAdminAuth,bannerController.showBannerMng)
router.post('/add',upload.array("image"),bannerController.postBannerManagement)

module.exports = router;