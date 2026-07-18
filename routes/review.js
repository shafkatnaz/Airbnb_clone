const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); //import Listing model [enabled find({}), update..]
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// REVIEWS: post route:
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.newReview));

// review delete:
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;
