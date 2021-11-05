
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
    const optionalString = { type: String, default: '' };
    const defaultTime = { type: Number, default: Date.now };
    const falseDefault = { type: Boolean, default: false };

    const userSchema = new Schema({
        email: { ...requiredString, unique: true },
        username: requiredString,
        password: requiredString,
        gender: optionalString,
        height: optionalString, 
        weight1: optionalString,
        weight2: optionalString,
        valid_email: falseDefault,
        email_time: defaultTime,
        profile_photo: { type: String, default: 'prfp.PNG' },
        cover_photo: { type: String, default: 'fb-cover-1.PNG' },
    }, { timestamps: true });

    return mongoose.models.user || mongoose.model("user", userSchema);
};

module.exports = config;
