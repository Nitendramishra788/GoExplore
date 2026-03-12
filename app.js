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
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const User = require("./models/user.js");
const UserRouter = require("./routes/user.js");
const isLoggedIn = require("./middleware.js").isLoggedIn;

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/expressErr.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const locationRouter = require("./routes/location.js");

const port = 3000;





// ================= DATABASE =================

const dburl = process.env.MONGO_URL;

mongoose.connect(dburl)
.then(()=>{
  console.log("MongoDB connected successfully");
})
.catch((err)=>{
  console.log(err);
});





// ================= SESSION STORE =================

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret:"thisshouldbeabettersecret!"
  },
  touchAfter: 24*3600
});

store.on("error",(err)=>{
  console.log("Error in Mongo Session Store",err);
});





// ================= SESSION CONFIG =================

const sessionOptions = {
  store,
  secret:"thisshouldbeabettersecret!",
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};





// ================= VIEW ENGINE =================

app.set("view engine","ejs");
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));





// ================= SESSION + FLASH =================

app.use(session(sessionOptions));
app.use(flash());





// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// ================= FLASH MIDDLEWARE =================

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
});





// ================= ROUTES =================

app.get("/",(req,res)=>{
  res.send("Home Page (GoExplore)");
});

app.use("/location",locationRouter);
app.use("/signup",UserRouter);





// ================= REVIEWS =================

// Create Review
app.post(
  "/location/:id/reviews",
  isLoggedIn,
  wrapAsync(async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing) throw new ExpressErr(404,"Listing not found");

    const newReview=new Review(req.body.review);
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();

    req.flash("success","New Review created!");
    res.redirect(`/location/${listing._id}`);
  })
);



// Delete Review
app.delete(
  "/location/:id/reviews/:reviewId",
  isLoggedIn,
  wrapAsync(async(req,res)=>{
    const {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{
      $pull:{reviews:reviewId}
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review deleted successfully!");
    res.redirect(`/location/${id}`);
  })
);





// ================= 404 =================

app.use((req,res,next)=>{
  next(new ExpressErr(404,"Sorry, page not found"));
});





// ================= ERROR HANDLER =================

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("err.ejs",{message});
});





// ================= SERVER =================

app.listen(port,()=>{
  console.log(`Server running on port ${port}`);
});