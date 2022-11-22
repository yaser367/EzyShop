const { application } = require("express");
const express = require("express");
const router = express();
const categoryController = require('../controllers/categoryController')
const path = require('path')
const Auth = require('../middlewares/adminmid')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/category"));

router.get('/categories',Auth.isAdminAuth,categoryController.getCategoryPage)
router.get('/',categoryController.getCategory)
router.post('/add',categoryController.addCategory)
router.get('/edit',Auth.isAdminAuth,categoryController.getEditCategory)
router.post('/edit',categoryController.postEditCategory)
router.get('/delete',Auth.isAdminAuth,categoryController.deleteCategory)
router.put('/block/:id',categoryController.blockCategory)
router.put('/unblock/:id',categoryController.unblockCategory) 


module.exports = router;





