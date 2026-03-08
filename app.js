
if (process.env.NODE_ENV !== "production") {
  console.log("Loading .env file...");
  require("dotenv").config();
}


const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserRouter = require("./routes/user.js");
const isLoggedIn = require("./middleware.js").isLoggedIn;






// here part of session and flash  

const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
  secret: "thisshouldbeabettersecret!",
  resave:false,
  saveUninitialized:false, 
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};

// Home
app.get("/", (req, res) => {
  res.send("Home Page (GoExplore)");
});

// part of session and flash
app.use(session(sessionOptions));
app.use(flash());

// part of passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// part success and error flash middleware
app.use((req , res , next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  // console.log(res.locals.success);
  next();
})





const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/expressErr.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//  ROUTER 
const locationRouter = require("./routes/location.js");
// const e = require("connect-flash");

const port = 3000;


// View Engine & Middleware

app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// Database Connection

main()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/GoExplore");
}


// Routes


// all  ROUTERS fixsing here
app.use("/location", locationRouter);
app.use("/signup", UserRouter);





// Reviews Routes 


// Create Review
app.post(
  "/location/:id/reviews",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressErr(404, "Listing not found");

    const newReview = new Review(req.body.review);
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success"," New Review created!");
    res.redirect(`/location/${listing._id}`);
  })
);

// Delete Review
app.delete(
  "/location/:id/reviews/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/location/${id}`);
  })
);


// Page Not Found

app.use((req, res, next) => {
  next(new ExpressErr(404, "Sorry, page not found"));
});


// Error Handling Middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("err.ejs", { message });
});


// Server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


