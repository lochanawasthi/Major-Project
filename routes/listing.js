const express =require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")



const listingController = require("../controllers/listings.js");



//index Route
router.get("/",wrapAsync(listingController.index));
 



 //NEw Route
 router.get("/new",isLoggedIn,listingController.renderNewForm);
 



 //Show Route
 router.get("/:id", wrapAsync(listingController.showListing));




 //Create Route
 router.post("/", 
    validateListing,
    isLoggedIn,
    wrapAsync(listingController.createListing));
   


   //Edit Route
   router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.rendereditForm));
   


   //Update Route
  router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));
   




   //delete route
   router.delete("/:id",isLoggedIn,isOwner,
     wrapAsync(listingController.destroyListing));




   module.exports = router;
   