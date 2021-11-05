const express = require('express');
const config = require('../models/user');
const { hashSync } = require('bcryptjs');
const { mailer } = require('../utils/utility');
const { getEncodedStringValue } = require('../utils/encode');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { json } = require('express');
const router = express.Router();
router.use(express.static('client'));
router.use(express.json());

router.post('/', async (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let mailID = uuidv4();
    /*
     Let's be sure nobody sends an absolutely invalid request.
     Need to be sure that all required fields have useful values
    */
    const valid = email.match(/(\w+)@(\w+)\.(\w+)/)
        && username.replace(/\W+/g, '').length > 2
        && password.replace(/\s+/g, '').length > 5;

    if (!valid) {
        res.json({ status: false });
    }
    
    const host = req.hostname;
    const liveLink = 'https://app-space.com';
    /*
    encode the email and send it as part of the url, 
    then decode it once they get back through the link
    */
    const encodedEmail = getEncodedStringValue(email);
    let link = host === "localhost" ?
        `http://localhost:3000/verify/${encodedEmail}`
        : `${liveLink}/verify/${encodedEmail}`;

    
    // Send the verification email
    const mail = await mailer(email, link, username, mailID);
    
    const data = { ...req.body };
    data.password = hashSync(data.password);
    const User = config(host);
    
    try {
        const newUser = await new User(data);
        const newDoc = await newUser.save();
        if(newDoc){
            const doc = { 
                email: data.email, 
                username: data.username, 
                password: '', 
                gender: data.gender, 
                height: data.height, 
                weight1: data.weight1, 
                weight2: data.weight2,
                profile_photo: data.profile_photo, 
                cover_photo: data.cover_photo 
            };
            await res.json({ status: true, ...doc });
        }else{
            await res.status(500).json({ status: false, reason: 'Ooops! something happend' });
        }
    } catch (error) {
        if(error.keyPattern.email){
            await res.json({ status: false, reason: `Email already in use, please try again` });
        }else{
            await res.status(500).json({ sent: false, message: 'Ooops! something happend' });
        }
        //await console.log(JSON.stringify(error));
        //await res.json({ sent: false });
    }
});


module.exports = router;