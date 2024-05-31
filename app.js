const express =require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
});

//NEw Route
app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async(req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
});


//Create Route
app.post("/listings", async(req , res)=>{
    // console.log("I am here at req.body");

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

});

//Edit Route
app.get("/listings/:id/edit", async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id",async( req, res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

});

//delete route
app.delete("/listings/:id", async(req, res)=>{
    let {id} =req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    res.redirect("/listings");
});



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

//my first api 
app.get("/",(req,res)=>{
    console.log("Server again working");
    res.send("Hi, i am root");
})


//Setting up port 
app.listen(8080,()=>{
    console.log("Server working");
})