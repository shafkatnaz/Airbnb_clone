const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

    // Clear old development data
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    // Create seed user
    const user = await User.register(
        new User({
            username: "shafkat",
            email: "shafkatnaz234@gmail.com",
            verified: true
        }),
        "123456"
    );

    // Give every listing the seed user as owner
    const listings = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));

    await Listing.insertMany(listings);

    console.log("Data initialized!");
    console.log("Seed user:", user.username);
    console.log("Seed user ID:", user._id);
};

initDB();












// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//     console.log("connnection successful");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async() => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({ 
//         ...obj, 
//         owner: "6a4a44a99717d622f4ad55bf",
//     }));
//     await Listing.insertMany(initData.data);
//     console.log("data initialized!");
// }
// initDB();