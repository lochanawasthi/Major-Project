
const User = require("../models/user");

module.exports.renderLoginForm =(req,res)=>{ 
    // res.send("hey i am at login page");
        //login get
     res.render("users/login.ejs");
};


module.exports.Login = async(req,res)=>{//login post
    req.flash("success","Welcome To WanderLust! ");
    let redirectUrl = res.locals.redirectUrl || "listings";
    res.redirect(redirectUrl);
};



module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
   };


   module.exports.Logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logout!");
        res.redirect("/listings");
   })
}
module.exports.signup = async(req,res)=>{
    try
    {
        let {username,email,password} = req.body;
        const newUser = new User({email, username});
         const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        req.login(registerUser, (err)=>{
            if(err){
                 return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
             res.redirect("/listings");
        });
        
    }

        catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};