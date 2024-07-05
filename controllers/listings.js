const Listing = require("../models/listing");


module.exports.index =async(req,res)=>{
    const allListings = await Listing.find({})
     res.render("listings/index.ejs",{allListings});
 };


module.exports.renderNewForm = (req,res)=>{
   
    res.render("listings/new.ejs");
 };



 module.exports.showListing = async(req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
           path:"author", //every review with author
       },
    })
    .populate("owner");

    if(!listing){
       req.flash("error", "Lisiting You Searching Does not exists ");
       res.redirect("/listings");
    }
     console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing =async(req , res, next) => {
       
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Created Lisitings");
     res.redirect("/listings");
    }

    module.exports.rendereditForm = async (req,res)=>{
        let{id} =req.params;
        const listing = await Listing.findById(id);
        if(!listing){ //if lisiting not exists no data in database
         req.flash("error", "Lisiting You Searching Does not exists ");
         res.redirect("/listings");
      }
 
        console.log(listing);
        req.flash("success", "Edited");
        res.render("listings/edit.ejs",{listing});
    };


    module.exports.updateListing = async( req, res)=>{
        let {id} = req.params;

       await Listing.findByIdAndUpdate(id,{...req.body.listing});

       req.flash("success", "Lisiting Updated!");

       res.redirect(`/listings/${id}`);
   
   };


   module.exports.destroyListing = async(req, res)=>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};