const express = require("express");
const router  = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { SaveRedirectUrl } = require("../middleware.js");
const UserController = require("../controller/users.js");


// signup form route 

router.get("/",UserController.renderSingupFrom);


// signup route

router.post(
  "/",
  wrapAsync(UserController.renderSingup)   
);



// login form route
router.get("/login", UserController.renderLoginForm);


// lgoin route authenticate by passport middleware

router.post("/login",SaveRedirectUrl , passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), UserController.renderLogin
 );

 
//  logout route

router.get("/logout", UserController.renderLogout);




module.exports = router;