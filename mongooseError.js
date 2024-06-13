const handleValidatorErr = (err) =>{
    console.log("This is a validatuon error. please follow rules");
    console.dir(err.message);
    return err;
}

application.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "VaidationError"){
        err = handleValidatorErr(err);
    }
    next(err);
});