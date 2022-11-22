const express = require("express");
const router = express();
const path = require("path");
const userProductController = require('../controllers/userProductController')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/users/product"));


const Auth = require('../middlewares/usermid')


router.get('/viewProduct',userProductController.viewProductByCat)
router.get('/one',userProductController.oneProduct)

module.exports = router;
