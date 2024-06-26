const express =require("express");
const app = express();
const mongoose = require("mongoose");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");


const listings= require("./routes/listing.js");
const reviews = require("./routes/review.js");


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use("public")


const sessionOptions= {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now() + 7 * 24 *60 *60 *1000,
        maxAge:7 * 24 *60 *60 *1000,
        httpOnly: true,
    },
};

//my first api 
app.get("/",(req,res)=>{
    console.log("Server again working");
    res.send("Hi, i am root");
    
});




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



app.use(session(sessionOptions));
app.use(flash());///this should be before routes.


//middle ware fore flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    console.log(res.locals.success);
    next();
});


app.use("/listings",listings); ///for Routes to connect 
app.use("/listings/:id/reviews", reviews); ///for reviews in routers folder



app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

//Middleware for error
app.use((err,req,res,next)=>{
    let{statusCode = 500, message ="Something Went Wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});




//Setting up port 
app.listen(8080,()=>{
    console.log("Server working");
})