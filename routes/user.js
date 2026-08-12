const express = require("express");
const router = express.Router({});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

// EMAIL VERFICATION
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.get("/verify/:token", userController.tokenVerify);

// PASSWORD RESET:
router.route("/forgot-password")
.get(userController.renderEmailForm)
.post(wrapAsync(userController.sendPasswordResetEmail));

router.route("/resetPass/:token")
.get(userController.renderResetPassForm)
.post(wrapAsync(userController.resetPassword));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local',   //authenticate user
        { failureRedirect: '/login',
        failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);
    
module.exports = router;
