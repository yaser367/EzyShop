const express = require("express");
const router = express();
const Auth = require('../middlewares/adminmid')
const path = require("path");
const adminController = require('../controllers/adminController')


router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views/admin"));


//admin routes
router.get("/dash",Auth.isAdminAuth,adminController.getAdminDashboards);
router.get("/login",Auth.isAdminLogin,adminController.getAdminLogin);
router.post('/login',adminController.postAdminLogin)
router.post('/logout',adminController.adminLogout)
router.get('/showUser',Auth.isAdminAuth,adminController.showUser)
router.put('/editStatusBlock/:id',adminController.editUserStatus)
router.put('/editStatusUnblock/:id',adminController.editUserStatusUnblock)

module.exports = router;