const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { hashSync, compareSync, } = require('bcryptjs');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('../models/food');
router.use(express.static('client'));
router.use(express.json());


router.get('/verify/:token/:pass', (req, res) => {
    const { token, pass } = req.params;
    //const rawToken = 'xP0g5';
    //const rawPass = ')v*A1';
    const hashTok = '$2a$10$RzoyaNb5v11XGEDSmj5JYeXjdNlBUwzLtZorSQHGaBR41QJT5YrGe';
    const hashPass = '$2a$10$BkwIdoWXfaLkqnDwJ7Z6Cu79pdo//4WYwrT3mVb4/ow3G9ogS7Ioq';
    //const hashTok = hashSync(rawToken);
    //const hashPass = hashSync(rawPass);
    
    if(compareSync(token, hashTok) && compareSync(pass, hashPass)){
        res.json({ status: true });
    }else{
        res.json({ status: false });
    }
});

router.get('/food/load', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const Food = config(req.hostname);
        const doc = await Food.find({});
        await res.json(doc);
    }
});

router.put('/food/new', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')) {
        const Food = config(req.hostname);
        const name = req.body.name;
        const slug = req.body.slug;
        const category = req.body.category || '';
        const ingredients = req.body.ingredients || {};

        const data = {
            name: name,
            slug: slug,
            category: category,
            ingredients: { ...ingredients },
            images: [],
        };

        const newFood = await new Food(data);
        try {
            const newDoc = await newFood.save();
            console.log(newDoc);
            await res.json({status: true});
        }catch(err){
            res.json({status: false});
            console.log(err);
        }
    }else{
        res.status(500).json({ status: false });
    }
});

module.exports = router;
