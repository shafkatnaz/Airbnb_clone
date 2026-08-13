if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose"); //connects Node.js with MongoDB
const path = require("path"); //Node's built-in module for handling file paths safely
const methodOverride = require("method-override"); //allows forms to simulates PUT,DELETE request[html supports POST,GET]
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const express = require("express"); //creates web server & routes
const app = express(); //app is used to configure & run the server
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const countries = require("./utils/country.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //stores MongoDB connection string [database name her is wanderlust]

main().then(() => {
    console.log("connnection successful");
})
.catch(err => console.log(err));

async function main() { //connects my application with MongoDB
  await mongoose.connect(MONGO_URL);
}

app.set("views", path.join(__dirname, "/views")); //eg of{path} above line [this works correctly],{Tells express where all ejs files are stored}
app.set("view engine", "ejs"); //sets ejs as templete engine

app.use(express.urlencoded({extended: true})); //reads form's data sent from html forms
app.use(express.json());
app.use(methodOverride("_method")); //activates method-override & [looks for _method in url]
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};



app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); //starts passport.
app.use(passport.session()); //keeps user logged in.
passport.use(new LocalStrategy(User.authenticate())); //register strategy.

passport.serializeUser(User.serializeUser()); //save user ID in session.
passport.deserializeUser(User.deserializeUser()); //Get full user from ID.

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //this is existed user's information.
    next();
});

app.use((req, res, next) => {
    res.locals.countries = countries;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("/*splat", (req, res, next) => {
    next(new expressError(404, "PAGE NOT FOUND!"));
});
// err handling middleware:
app.use((err, req, res, next) => {
    let{status = 500, message = "ERROR OCCURED!"} = err;
    res.status(status).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Server is listening");
});
