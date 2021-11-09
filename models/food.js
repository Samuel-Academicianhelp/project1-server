
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
    const trueDefault = { type: Boolean, default: true };

    const userSchema = new Schema({
        name: { ...requiredString, },
        slug: { ...requiredString, unique: true },
        category: optionalString,
        ingredients: { type: Object },
        images: [ String, ],
        avaliability: trueDefault,
    }, { timestamps: true });

    return mongoose.models.food || mongoose.model("food", userSchema);
};

module.exports = config;
