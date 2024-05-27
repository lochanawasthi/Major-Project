const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
        type:String,
        required:true,

    },

    description:String,

    image:{
        type:String,
        default:"https://www.pexels.com/photo/wide-angle-photo-of-road-1563355/",
        set: (v) => v === "" ? "https://www.pexels.com/photo/wide-angle-photo-of-road-1563355/" : v,
    },

    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;