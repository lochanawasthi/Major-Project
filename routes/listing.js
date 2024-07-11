const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//GEt Post for Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    // validateListing,
    upload.single("listing[image]"),
    isLoggedIn,
    wrapAsync(listingController.createListing)
  );

//NEw Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Get Delete Update Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );

//Create Route
router;

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rendereditForm)
);

module.exports = router;
