const User = require("../models/user.js");
const generateRandomString = require("../utils/token");
const {sendVerificationEmail, sendPasswordResetEmail} = require("../utils/nodemailer");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const userInfo = await User.register(newUser, password);
        
        const token = generateRandomString(32);
        userInfo.verificationToken = token;
        await userInfo.save();
        
        const verificationLink = `http://localhost:8080/verify/${token}`;
        await sendVerificationEmail(email, verificationLink);
        
        console.log(userInfo);
        req.flash("success", "Verification email sent. Please check your email before logging in.");
        res.redirect("/login");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.tokenVerify = async (req, res) => {
    const { token } = req.params; //req.params contains the route parameter name
    const tokenVerifiedUser = await User.findOne({ verificationToken: token });
    if(!tokenVerifiedUser){
        req.flash("error", "Invalid or expired verification link.");
        return res.redirect("/signup");
    }else{
        (tokenVerifiedUser.verified = true);
        tokenVerifiedUser.verificationToken = null;
        await tokenVerifiedUser.save();
    }
    req.flash("success", "User Verified!.");
    res.redirect("/login");
};
// GET(/forgot-password)
module.exports.renderEmailForm = (req, res) => {
    res.render("users/forgot-password.ejs");
};
// POST(/forgot-password)
module.exports.sendPasswordResetEmail = async(req, res) => {
    try{
        let {email} = req.body;
        const existedEmail = await User.findOne({ email });
        if (!existedEmail) {
            req.flash("error", "No account exists with this email.");
            return res.redirect("/forgot-password");
        }
        const token = generateRandomString(32);
        existedEmail.passwordResetToken = token;
        await existedEmail.save();

        const resetLink = `http://localhost:8080/resetPass/${token}`;
        await sendPasswordResetEmail(email, resetLink);
        
        console.log(existedEmail);
        req.flash("success", "Password reset email sent. Please check your email to reset password.");
        return res.redirect("/login");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/login");
    }
};
// GET(/resetPass/:token)
module.exports.renderResetPassForm = async (req, res) => {
    const { token } = req.params; //req.params contains the route parameter name
    const existedUser = await User.findOne({ passwordResetToken: token });
    if(!existedUser){
        req.flash("error", "Invalid or expired verification link.");
        return res.redirect("/forgot-password");
    }else{
        res.render("users/resetPass.ejs", { token });
    }
};
//POST(/resetPass/:token)
module.exports.resetPassword = async (req, res) => {
    const {token} = req.params; //req.params contains the route parameter name
    const existedUser = await User.findOne({ passwordResetToken: token });
    if(!existedUser){
        req.flash("error", "Invalid or expired password reset link.");
        return res.redirect("/forgot-password");
    }else{
        const {password} = req.body;
        await existedUser.setPassword(password);
        existedUser.passwordResetToken = null;
        await existedUser.save();
    }
    req.flash("success", "Password Changed!.");
    res.redirect("/login");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login = async(req, res, next) => {
    if(!req.user.verified) {
        return req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("error", "Please verify your email before logging in.");
        return res.redirect("/login");
        });
    }
    req.flash("success", "You logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you logged out");
        res.redirect("/listings");
    });
};

// req.login(registeredUser, (err) => {
//             if(err) {
//                 return next(err);
//             }
//             req.flash("success", "Welcome to wanderlust!");
//             res.redirect("/listings");
        