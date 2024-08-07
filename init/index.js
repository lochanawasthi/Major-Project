const mongoose  = require("mongoose");
const initData = require("./data.js");
const Listing =require("../models/listing.js");

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

const initDB = async () =>{
    await Listing.deleteMany({});
    
    initData.data = initData.data.map((obj)=>({...obj,owner:"6686db068b93b901101170c8"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();