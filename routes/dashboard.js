const route = require('express').Router();
const ROLE_ADMIN  = require('../utils/checkRole');
const {renderToView}       =require('../utils/checkRouting')
const USER_MOD = require('../models/user')

/*
    RANDER PAGE DASHBOARD
*/

route.get('/',ROLE_ADMIN, async (req,res)=>{
       renderToView(req,res, 'dashboard/pages/dashboard',{})
     
})
/*
    RANDER PAGE LOGIN FOR DASHBOARD
*/
route.get('/login', async (req,res) =>{
    
       renderToView(req,res ,'dashboard/pages/login',{})
    })

route.post('/login', async (req ,res)=>{
       let { username , password } = req.body;
       let infoUser= await USER_MOD.singIn({username,password});
       if(infoUser.error) 
       {
           return res.json(infoUser);
       }
       /*
             DEVICE TOKEN AND SAVE IN SESSION
        */
        req.session.token = infoUser.data.token;
        req.session.user = infoUser.data;
        res.json(infoUser.data);
   })


module.exports= route;