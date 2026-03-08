const User = require("../models/user");


// ===============================
// Render Signup Form
// ===============================
module.exports.renderSingupFrom = (req, res) => {
  res.render("users/signup.ejs");
};


// ===============================
// Signup Controller
// ===============================
module.exports.renderSingup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to GoExplore 🎉");
      res.redirect("/location");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


// ===============================
// Render Login Form
// ===============================
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};


// ===============================
// Login Success Controller
// ===============================
module.exports.renderLogin = (req, res) => {
  req.flash("success", "Welcome back to GoExplore ✨");
  res.redirect(res.locals.redirectUrl || "/location");
};


// ===============================
// Logout Controller
// ===============================
module.exports.renderLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success", "Logged out successfully.");
    res.redirect("/location");
  });
};
