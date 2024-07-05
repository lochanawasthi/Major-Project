const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",

        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing)
    await Review.deleteMany({_id : {$in : listing.reviews}});
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;