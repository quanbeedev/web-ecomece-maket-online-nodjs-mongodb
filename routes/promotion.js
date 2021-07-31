const route= require('express').Router();
const {uploadMulter} = require('../utils/config_multer')
const ROLE_ADMIN= require('../utils/checkRole');
const {renderToView} = require('../utils/checkRouting')
const PROMOTION_MOD= require('../models/promotion');
const { Router } = require('express');

route.get('/them',async (req,res)=>{
    res.render('dashboard/pages/add-promotion')
})

route.post('/add',uploadMulter.single('avatar'),async (req,res)=>{
    let {title, content, percent,status} =req.body;
    let infofile = req.file;
    // console.log({title,content,percent,avartar:infofile.originalname,status});
    let infoPromotion= await PROMOTION_MOD.insert({title,content,percent,avartar: infofile.originalname,status});
    console.log({infoPromotion})
    if(!infoPromotion.error) 
    res.json({infoPromotion})
})
route.get('/list',async (req,res)=>{
    renderToView(req,res,'dashboard/pages/list-promotion',{})
})
route.get('/:id?', async (req,res)=>{
    let {id} = req.params;
    let getId= await PROMOTION_MOD.getId({id});
    res.json({getId})
})
route.get('/edit/:id', async (req,res)=>{
    let {id} = req.params;
    let result = await PROMOTION_MOD.getId({id});
    res.render('dashboard/pages/edit-promotion', {result: result.data})
})
route.get('/update/:id', async (req,res)=>{
    let {id} = req.params;
    let infofile = req.file;
    let {title,content,percent,status} = req.body;
    console.log({title,content,percent,avatar: infofile.originalname,status})
    let infoPromotion = await PROMOTION_MOD.update({id,title,content,percent,avatar: infofile.originalname,status})
    if(!infoPromotion) return res.json({infoPromotion});
    res.json({infoPromotion: infoPromotion.data})
})
route.get('/remove/:id', async (req,res)=>{
    let {id} = req.params;
    let deletePromotion = await PROMOTION_MOD.remove({id});
    if(!deletePromotion.error)
    res.json({deletePromotion: deletePromotion.data})
    res.redirect('/promotions/list')
})
module.exports= route;
