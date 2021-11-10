
require('dotenv').config();
const mongoose = require("mongoose");

const LOCAL = process.env.LOCAL_MONGODB_URI;
const LIVE = process.env.MONGO_CONN_STR;

/** 
 * Determine if app is running locally or not. 
 * this way there will be no changes to make concerning API endpoints
 */
const config = (hostname) => {
    const host = hostname === "localhost" ? LOCAL : LIVE;
    mongoose.connect(host, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true });
    const Schema = mongoose.Schema;
    
    // Declare the field options and constraints
    const requiredString = { type: String, required: true };

    const userSchema = new Schema({
        category: { ...requiredString, unique: true },
        food: [ String, ],
    }, { timestamps: true });

    return mongoose.models.category || mongoose.model("category", userSchema);
};

module.exports = config;
