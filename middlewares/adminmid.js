const isAdminAuth = async (req, res, next) => {
    if (req.session.isAdd) {
      next();
    } else {
      res.redirect("/admin/login");
    }
  
};
const isAdminLogin = async(req,res,next)=>{
  if(req.session.isAdd){
      res.redirect('/admin/dash')
  }else{
      next();
  }
 
}



module.exports = {
  isAdminAuth,
  isAdminLogin

}