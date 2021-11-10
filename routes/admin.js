const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { hashSync, compareSync, } = require('bcryptjs');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const router = express.Router();
const foodConfig = require('../models/food');
const categoryConfig = require('../models/foodCategory');
router.use(express.static('client'));
router.use(express.json());


router.get('/verify/:email/:password', (req, res) => {
    const { email, password } = req.params;
    const adminEmail = 'samuel.adiele@academicianhelp.com';
    const hashPass = '$2a$10$BkwIdoWXfaLkqnDwJ7Z6Cu79pdo//4WYwrT3mVb4/ow3G9ogS7Ioq';
    
    if(email === adminEmail && compareSync(password, hashPass)){
        res.json({ status: true });
    }else{
        res.json({ status: false });
    }
});

router.put('/food/update', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const Food = foodConfig(req.hostname);
        const doc = await Food.updateOne({ slug: 'african-salad' }, { $set: { "ingredients.status": 0 }});
        await res.json({status: doc.modifiedCount ? true : false});
    }
});
/*
router.get('/food/update', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    //if (ck.hasOwnProperty('admin')){
        const Food = foodConfig(req.hostname);
        const doc = await Food.updateOne({ slug: 'african-salad' }, { $set: { "ingredients.status": 0 }});
        await res.json({status: doc.modifiedCount ? true : false});
    //}
});
*/
router.get('/food/load', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const Food = foodConfig(req.hostname);
        const doc = await Food.find({});
        await res.json(doc);
    }
});

router.get('/fetch/category', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const Category = categoryConfig(req.hostname);
        const doc = await Category.find({});
        await res.json(doc);
    }
});

router.put('/update/patch', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const Food = foodConfig(req.hostname);
        let field = {};
        if(req.body.field === "name"){
            field = { name: req.body.value, slug: req.body.value.toLowerCase().replace(/\s+/g,'-') };
        }else if(req.body.field === "category"){
            field = { category: req.body.value };
        }
        
        const doc = await Food.updateOne({ slug: req.body.slug }, { $set: field });
        await res.json({status: doc.modifiedCount ? true : false});
    }
});

router.post('/food/add/category', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')){
        const FoodCategory = categoryConfig(req.hostname);
        // request properties: category
        const category = req.body.category;
        if(category){
            const data = { category: category, food: [] };
            try{
                const newDoc = await new FoodCategory(data).save();
                await res.json({ status: true });
            }catch(err){
                console.log(err);
                res.json({ status: false });
            }
        } 
    }
});

router.put('/food/new', async (req, res) => {
    const ck = cookie.parse(req.headers.cookie || '{}');
    if (ck.hasOwnProperty('admin')) {
        const Food = foodConfig(req.hostname);
        const name = req.body.name;
        const slug = req.body.slug;
        const category = req.body.category || '';
        const ingredients = req.body.ingredients || {};
        
        const data = Object.keys(ingredients).length > 0 ? {
            name: name,
            slug: slug,
            category: category,
            ingredients: { ...ingredients },
            images: [],
        } : {
            name: name,
            slug: slug,
            category: category,
            ingredients: { status: false },
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
