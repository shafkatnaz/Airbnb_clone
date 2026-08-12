const Listing = require("../models/listing");
const categories = require("../utils/category.js");
const ExpressError = require("../utils/expressError.js");

// pagination:
module.exports.index = async (req, res) => {
    const currPage  = Number(req.query.page);
    if(!currPage){
        return res.redirect("/listings?page=1");
    }
    const next = currPage+1;
    const totalListings = await Listing.countDocuments({});
    const limit = 6;
    const totalPages = Math.ceil(totalListings / limit);
    const skip = (currPage-1)*limit;
    const allListings = await Listing.find({}).skip(skip).limit(limit);
    res.render("listings/index.ejs", {allListings, totalPages, currPage, next});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { categories});
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    console.log("REQ.USER:", req.user);
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
        path: "author"}
    })
        .populate("owner");
    if(!listing) {
        req.flash("error", "listing not exists");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
        
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //this will store new user's id.
    newListing.image = {url, filename};
    await newListing.save();
    console.log(newListing);
        
    req.flash("success", "New listing added");
    res.redirect("/listings");    
};

module.exports.filtered = async (req, res) => {
    const { category } = req.params;
    const filteredListings = await Listing.find({ category });
    res.render("listings/index", {allListings: filteredListings});
};

module.exports.selectedCountry = async (req, res) => {
    const { country } = req.params;
    const countryListings = await Listing.find({ country });
    console.log("found:", countryListings.length)
    res.render("listings/index", {allListings: countryListings});
};

module.exports.selectedLocation = async (req, res) => {
    const location = req.query.location.trim();
    const locationListings = await Listing.find({ location: {$regex: `^${location}$`,$options: "i"} });
    if(locationListings.length === 0) {
        console.log("not exists!");
        req.flash("error", "Not Available!");
        return res.redirect("/listings");
    }
    console.log(locationListings);
    res.render("listings/index", {allListings: locationListings });
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing not exists");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150,h_100,c_fill");
    res.render("listings/edit.ejs", {
        listing,
        originalImageUrl,
        categories
    });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};
