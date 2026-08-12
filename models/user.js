
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    verified: {
    type: Boolean,
    default: false
    },
    verificationToken: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
});
userSchema.plugin(passportLocalMongoose); //this will implements hashing, username,
module.exports = mongoose.model('User', userSchema);
