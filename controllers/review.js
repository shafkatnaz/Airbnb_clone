const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.newReview = async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New review added!");
    
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
        let {id, reviewId} = req.params;

        let delListing = await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        let delReview = await Review.findByIdAndDelete(reviewId); //as this is called middleware in listing will also run
        req.flash("success", "Review deleted!");
        res.redirect(`/listings/${id}`);
    };