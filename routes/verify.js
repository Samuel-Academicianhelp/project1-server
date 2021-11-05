
const express = require('express');
const config = require('../models/user');
const bodyParser = require('body-parser');
const { recoverEncodedStringValue } = require('../utils/encode');
const router = express.Router();
router.use(express.static('client'));
router.use(express.json());

// Verify the email address
router.post('/email/:email', async (req, res) => {
    const encodedEmail = req.params.email;
    console.log(encodedEmail);
    const Users = config(req.hostname);
    if (!req.params.email) {
        res.json({ status: false });
    } else {
        // Decode the email
        let email = recoverEncodedStringValue(encodedEmail);
        
        // If any document was updated, email is valid.
        let update = await Users.updateOne({ email: email }, { $set: { "valid_email": true } });
        res.json({ status: update.modifiedCount ? true : false });
    }
});

module.exports = router;