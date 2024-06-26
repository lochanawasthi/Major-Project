const express =require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


//function for validate lisitng middle ware
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);//each lisitng validation 
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);//prompt for error
    }else{
        next();
    }
};


//index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({})
     res.render("listings/index.ejs",{allListings});
 }));
 


 //NEw Route
 router.get("/new",(req,res)=>{
 res.render("listings/new.ejs");
 });
 


 //Show Route
 router.get("/:id", wrapAsync(async(req,res)=>{
     let{id} =req.params;
     const listing = await Listing.findById(id).populate("reviews");
     // console.log(listing);
     res.render("listings/show.ejs",{listing});
 }));



 //Create Route
 router.post("", validateListing,

    wrapAsync(async(req , res, next) => {
       
   const newListing = new Listing(req.body.listing);
   
   await newListing.save();
   req.flash("success", "New Listing Created");
    res.redirect("/listings");
   })
   
   );
   

   //Edit Route
   router.get("/:id/edit", wrapAsync(async (req,res)=>{
       let{id} =req.params;
       const listing = await Listing.findById(id);
       res.render("listings/edit.ejs",{listing});
   }));
   

   //Update Route
  router.put("/:id",wrapAsync(async( req, res)=>{
       if(!req.body.listing){
           throw new ExpressError(400,"Send Valid data for Listing");
       }
       let {id} =req.params;
       await Listing.findByIdAndUpdate(id,{...req.body.listing});
       res.redirect(`/listings/${id}`);
   
   }));
   

   //delete route
   router.delete("/:id", wrapAsync(async(req, res)=>{
       let {id} =req.params;
       let deleteListings = await Listing.findByIdAndDelete(id);
       console.log(deleteListings);
       res.redirect("/listings");
   }));

   module.exports = router;
   