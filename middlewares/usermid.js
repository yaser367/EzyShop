const isAuth = async (req, res, next) => {
      if (req.session.isAuth) {
        next();
      } else {
        res.redirect("/login");
      }
    
  };
  const isLogin = async(req,res,next)=>{
    if(req.session.isAuth){
        res.redirect('/homePage')
    }else{
        next();
    }
   
  }



  module.exports = {
    isAuth,
    isLogin

  }