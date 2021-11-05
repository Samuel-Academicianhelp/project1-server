
const express = require('express');
const config = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { compareSync } = require('bcryptjs');
const router = express.Router();
router.use(express.static('client'));
router.use(express.json());

/**
 * field is the field used for searching and value is the field's value
 * field can be any of email or phone, used for login people in
 */
router.get('/:value/:password', async (req, res) => {
    const value = req.params.value;
    const field = value.match(/(\w+)@(\w+)\.(\w+)/) ? "email" : "phone"; 
    const password = req.params.password;
    console.log(field);
    const User = config(req.hostname);
    if (field === "email" || field === "phone"){
        let fieldset = {};
        fieldset[field] = req.params.value;
        const filter = { 
            email: 1, 
            username: 1, 
            password: 1, 
            gender: 1, 
            height: 1, 
            weight1: 1, 
            weight2: 1, 
            profile_photo: 1, 
            cover_photo: 1, 
            _id: 0
        };
        let doc = await User.findOne(fieldset, filter);

        if(doc != null){
            if(compareSync(password, doc.password)){
                /*
                  Keep the password field but remove the actual value
                  This will be useful when updating the field
                */
                doc.password = '';
                res.json({status: true, ...doc});
            }else{
                res.json({status: false, reason: "incorrect username or password"});
            }
        }else{
            res.json({status: false, reason: "We couldn't find this record"});
        }
    }else{
        res.json({ status: false });
    }
});

module.exports = router;

