module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path , ".." , req.originalUrl);
    if(!req.isAuthenticated()){
      // rediracturl
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must be logged in first!");

    return res.redirect("/signup/login");
  }else{
    next();
  }
}


module.exports.SaveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    delete req.session.redirectUrl;

  }
  next();
}

module.exports.isAuthor =(req , res, next)=>{
  if(!req.user || req.user.role !=="author"){
    req.flash("error" , "Access Denied !");
    return res.redirect("location");
  }

  next();
};