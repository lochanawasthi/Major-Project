if(process.env.NODE_ENV != "production"){
     require('dotenv').config();

}
   

console.log(process.env); // remove this after you've confirmed it is working


const express =require("express");
const app = express();
const mongoose = require("mongoose");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


///for route Listing and Review
const listingsRouter= require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URl;


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use("public")




const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{

    console.log("EErroro in MONgo Session Dtore", err);
});
   



const sessionOptions= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now() + 7 * 24 *60 *60 *1000,
        maxAge:7 * 24 *60 *60 *1000,
        httpOnly: true,
    },
   
};



//my first api 
// app.get("/",(req,res)=>{
//     console.log("Server again working");
//     res.send("Hi, i am root");
    
// });




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
    await mongoose.connect(dbUrl);
}


app.use(session(sessionOptions));
app.use(flash());///this should be before routes.



//passport implementation after seassions middleWare
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser()); // user info in session
passport.deserializeUser(User.deserializeUser());// unstore info in session


//middle ware fore flash
app.use((req,res,next)=>{

    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    
    console.log(res.locals.success);

    next();
});

// app.get("/demouser",async(req,res)=>{
// let fakeUser = new User({
//  email:"student@gmail.com",
//  username:"delts-student"
// });
//    let registeredUSer = await User.register(fakeUser, "helloworld");
//    res.send(registeredUSer);
// });

app.use("/listings",listingsRouter); ///for Routes to connect 
app.use("/listings/:id/reviews", reviewsRouter); ///for reviews in routers folder
app.use("/",userRouter);


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