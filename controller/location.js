const Listing = require("../models/listing");
const ExpressErr = require("../utils/expressErr");




// Index controller

module.exports.index = async (req, res) => {
  const allData = await Listing.find({});
  res.render("listing/index.ejs", { allData });
};


// new Route
module.exports.renderNewForn = (req, res) => {
  // console.log(req.user);
  res.render("listing/new.ejs");
  
};

// show Route
module.exports.renderShowPage = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

  if(!listing){
    req.flash("error","Listing not found");
    return res.redirect("/location"); 
  }
  
  res.render("listing/show.ejs", { listing });
};



// Create controller
module.exports.listingCreate = async (req, res) => {
// console.log(req.body);
console.log(req.file);
const url = req.file.path;
const filename = req.file.filename;
console.log(url, filename);
  const { title, description, price, location, image, country } = req.body;

  let imageData;

  if (image && image.trim() !== "") {
    imageData = {
      filename: "userImage",
      url: image,
    };
  } else {
    imageData = {
      filename: "defaultImage",
      url: "https://media.istockphoto.com/id/1347088244/photo/kerala-most-beautiful-place-of-india.jpg?s=1024x1024&w=is&k=20&c=TErl9Rcp8dHOUHxr96Wp4CrryOhCQcfdnCQARr9hWpc=",
    };
  }

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    // image: imageData,
    image: {
      url: url,
      filename: filename,
    },
    owner:req.user._id,   
  });


  await newListing.save();
  // here attaching flash message to the session
  req.flash("success"," New Listing created successfully!");
  res.redirect("/location");
};


// Edit controller

module.exports.renderEditPage = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
};


// Update controller

module.exports.updateListing = async (req, res) => {


  if (!req.body.listing) {
    throw new ExpressErr(400, "Send valid data for the listing");
  }

  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.send("Listing not found");
  }

  const { title, description, price, location, country, image } = req.body.listing;

  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  if (image && image.trim() !== "") {
    listing.image.url = image;
  }

  await listing.save();
  req.flash("success","Listing updated successfully!");
  res.redirect(`/location/${id}`);
};

// destroy controller

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success"," Listing deleted successfully!");
  res.redirect("/location");
};