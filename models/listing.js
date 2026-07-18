const mongoose = require('mongoose'); //Enabled Mongooose featuers[schema,models,find,update,delete & so on]
const schema = mongoose.Schema; //schema is blueprint
const Review = require('./review.js');

const listingSchema = new schema ({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
           type: schema.Types.ObjectId,
           ref: "Review",
        },
    ],
    owner:{
        type: schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["mountains", "arctic", "trending", "rooms", "iconic cities", "castles", "farm", "camping"],
    }
});


listingSchema.post("findOneAndDelete", async(listing) => { //if we deleted listing then reviews will be also deleted
    if(listing) {
        await Review.deleteMany({ _id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema); //model created called{Listing} [model is builder whos uses blueprint]
module.exports = Listing; //app.js can use mongoose features



// default: "https://unsplash.com/photos/vast-snowfield-before-rugged-mountains-with-clouds-under-blue-sky-7TV1KJGY36Q",
// set: (v) => v === "" ? "https://unsplash.com/photos/vast-snowfield-before-rugged-mountains-with-clouds-under-blue-sky-7TV1KJGY36Q": v,