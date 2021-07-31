const route = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const ROLE_ADMIN = require('../utils/checkRole');
const CATEGORY_MOD = require('../models/category');
const {renderToView} = require('../utils/checkRouting')
const   {uploadMulter} = require('../utils/config_multer')
const { CF_ROUTING} = require('../constant/core/base_ipi')
const { CF_ROUTINGPAGE } = require('../constant/core/baseApiPage')

            /*RANDER PAGE THEM SAN PHAM*/

route.get(CF_ROUTING.ADD_CATEGORY, async (req,res)=>{
    res.render(CF_ROUTINGPAGE.ADD_CATEGORY);
})
            /*RANDER PAGE THEM SAN PHAM*/
route.post( CF_ROUTING.ADD_CATEGORY ,async (req,res) =>{
  
    let{ title, description } = req.body;
    let infoCategoryAfterInsert = await CATEGORY_MOD.insertCategoryIntoDataBase({ title , description });
    if( infoCategoryAfterInsert.error )
    {
         return res.json({ infoCategoryAfterInsert });
    }
    res.json({ infoCategoryAfterInsert : infoCategoryAfterInsert.data });
    res.redirect( CF_ROUTINGPAGE.LIST_CATEGORY );
    
})

            /* RANDERPAGE PUSH LIST CATEGORY FROM DATABASE TO VIEW*/

route.get( CF_ROUTING.LIST_CATEGORY , async (req,res)=>{

    renderToView(req, res, 'dashboard/pages/list-category' , { } )

})

            /* GET ID CATEGORY FROM DATABASE*/

route.get( CF_ROUTING.ID_CATEGORY , async (req,res)=> {

    let { id } = req.params;
    let infoCategory= await CATEGORY_MOD.getId({ id });
    return res.json({ infoCategory: infoCategory.data });

})

            /* RANDER PAGE EDIT CATEGORY*/

route.get( CF_ROUTING.EDIT_CATEGORY , async (req,res)=>{

    let{ id } = req.params;
    let result = await CATEGORY_MOD.getId({ id });
    res.render( 'dashboard/pages/edit-category' , { result: result.data });

})

            /* UPDATE CATEGORY WAS EDITED INTO DATABASE*/

route.post( CF_ROUTING.UPDATE_CATEGORY , uploadMulter.single('avatar'), async (req,res) => {

    let { id } = req.params;
    let{ title, description }= req.body;
    let infofile = req.file;
    let infoCategory = await CATEGORY_MOD.update({ id , title , description , avatar : infofile.originalname });
    res.jon({ infoCategory : infoCategory.data });

})

            /* REMOVE CATEGORY IN DATABASE*/

route.get( CF_ROUTING.REMOVE_CATEGORY ,async (req,res) => {

    let { id } = req.params;
    let removeCategory = await CATEGORY_MOD.remove({ id });
    res.redirect( CF_ROUTINGPAGE.LIST_CATEGORY )

})
module.exports = route