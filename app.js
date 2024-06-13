const express =require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");



app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use("public")

//seeting database with then and catch
main()
.then(()=>{
    console.log("Connected to database"); //Checking for connection
})
.catch((err)=>{
    console.log(err); ///Error 
})


//Setting up database
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//index Route
app.get("/listings",wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
}));

//NEw Route
app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}));


//Create Route
app.post("/listings", 

 wrapAsync(async(req , res, next) => {

    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data for Listing");
    }

const newListing = new Listing(req.body.listing);

await newListing.save();

 res.redirect("/listings");
})

);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",wrapAsync(async( req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data for Listing");
    }
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} =req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    res.redirect("/listings");
}));



// //testListing
// app.get("/testListing", async(req,res)=>{
// let sampleListing = new Listing({
//     tittle: "My New Villa",
//     description : "By the beach",
//     price:1220,
//     location:"Calangute, Goa",
//     country: "India",
// });
// await sampleListing.save();
// console.log("Sample was Saved");
// res.send("successful testing");

// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

//Middleware for error
app.use((err,req,res,next)=>{
    let{statusCode = 500, message ="Something Went Wrong!"}=err;
    // res.status(statusCode).send(message);
    res.ststus(statusCode).render("error.ejs",{message});
});

//my first api 
app.get("/",(req,res)=>{
    console.log("Server again working");
    res.send("Hi, i am root");
    
})


//Setting up port 
app.listen(8080,()=>{
    console.log("Server working");
})