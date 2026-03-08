const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/location.js");
const multer  = require("multer");
const { storage } = require("../cloudConfig.js");
const multerStorage = multer({ storage });  
const upload = multer({ storage: multerStorage.storage });

const {isAuthor} = require("../middleware.js");





// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isAuthor, isLoggedIn , listingController.renderNewForn);

// Create Route
router.post("/", upload.single("image") ,  isLoggedIn,wrapAsync(listingController.listingCreate));

// Show Route
router.get("/:id", wrapAsync(listingController.renderShowPage));

// Edit Route
router.get("/:id/edit", isAuthor, isLoggedIn, wrapAsync(listingController.renderEditPage));

// Update Route 
router.put("/:id",isLoggedIn ,wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isAuthor, isLoggedIn , wrapAsync(listingController.destroyListing));


module.exports = router;
