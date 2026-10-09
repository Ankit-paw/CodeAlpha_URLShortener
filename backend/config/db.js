const dns = require("dns");

// Use reliable DNS servers for MongoDB SRV lookup
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully ✅");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;