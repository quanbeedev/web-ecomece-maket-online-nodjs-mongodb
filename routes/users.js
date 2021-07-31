const route = require('express').Router();
const USER_COLL = require('../database/user');
const USER_MOD= require('../models/user');
const {renderToView} = require('../utils/checkRouting')

route.get('/list',async (req,res) =>{
    let listUser=await USER_MOD.getList()
    res.render('dashboard/pages/list-user',{listUser: listUser.data})
})
route.get('/:id?', async (req,res)=>{ 
    let {id} = req.params;
    let infoUser = await USER_MOD.getID({id});
    return res.json(infoUser.data)
})
route.get('/remove/:id', async (req,res)=>{
    let { id }= req.params;
    // console.log({id});
    let infoUser= await USER_MOD.remove({id});
    if(!infoUser) return res.json({infoUser});

})

module.exports = route;