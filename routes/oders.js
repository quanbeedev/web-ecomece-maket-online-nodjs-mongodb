const route = require('express').Router();
const ORDER_COLL = require('../database/order');
const ODER_MOD = require('../models/order');
let {renderToView}         = require('../utils/checkRouting')

/*
    RANDER PAGE LIST ORDER
*/

route.get('/danh-sach', async( req, res) =>{
    renderToView( req ,res, 'dashboard/pages/list-order' , { })
})

/*
    REMOVE ORDER IN DATABASE
*/
route.get('/remove-order/:id', async (req,res)=>{
    let { id } = req.params;
    let inforOrderAfterDelete = await ODER_MOD.remove(id);
    if(!inforOrderAfterDelete.error)
    res.json({inforOrderAfterDelete}) 
    res.redirect('/orders/danh-sach')
})

module.exports = route;
