const mongoose = require('mongoose'); //Enabled Mongooose featuers[schema,models,find,update,delete & so on]
const schema = mongoose.Schema; //schema is blueprint


const reviewSchema = new schema ({
    comment: String,
    rating: {
        type: String,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type: schema.Types.ObjectId,
        ref: "User",
    }

});

const Review = mongoose.model("Review", reviewSchema); //model created called{Listing} [model is builder whos uses blueprint]
module.exports = Review;