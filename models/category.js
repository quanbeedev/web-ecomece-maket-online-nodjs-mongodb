const { resolveCname } = require('dns');
const { resolve } = require('path');
const { title } = require('process');
const CATEGORY_COLL= require('../database/category');
const PRODUCT_COLL = require('../database/product');
const PROMOTION_COLL = require('../database/promotion');
const ObjectId = require('mongoose').Types.ObjectId;
const ROLE_ADMIN = require('../utils/checkRole');
const {renderToView} = require('../utils/checkRouting');

module.exports = class category extends CATEGORY_COLL{

/*  
    INSERT CATEGORY INTO DATABASE 
*/
                    
    static insertCategoryIntoDataBase({ title , description }){
     return new Promise(async resolve => {
         try {
            let checkExistNewResultCategory = await CATEGORY_COLL.findOne({ title });
            if( checkExistNewResultCategory )
            {
                 return resolve({ error: true , message : 'Exist' });
            }

            let resultTamporary = CATEGORY_COLL({ title , description });
            let newCategory = await resultTamporary.save();
            
            if( !newCategory ) return resolve({ error : true , message : 'insert Error' });
            {
                return resolve({error : false, data : newCategory});
            }
         } catch ( error ) {
             return resolve({ error: true, message : error.message })
         }   
     })
    }

 /*  
    GET LIST CATEGORY FROM DATABASE MONGODB 
*/

    static getList(){
        return new Promise(async resolve =>{
        try {
            let listCategory = await CATEGORY_COLL.find();
            if( !listCategory ) return resolve({ error : true , message : 'list not exist' }); 
            return resolve({ error : false , data : listCategory});
        } catch ( error) {
            return resolve({ error : true , message : error.message });
        }
     })

    }

/*
        GET DETAIL CATEGORY FROM DATABASE MONGODB 
*/

    static getId({ id }){
        return new Promise(async resolve =>{
            try {
                let inforCategory = await CATEGORY_COLL.findById( id )
                .populate('product');
                if( !inforCategory ) 
                {
                     return resolve({ error : true , message : 'can not find by id'});
                }
                     return resolve({ error : false , data : inforCategory })
            } catch (error) {
                return resolve({ error : true , message : error.message })
            }
        })
    }

 /*
        REMOVE CATEGORY IN DATABASE MONGODB 
*/

    static remove({ id }){
        return new Promise(async resolve=>{
            try {
                let removeCategory = await CATEGORY_COLL.findByIdAndDelete( id );
                if( !removeCategory ) return resolve({error : true,message :' can not remove'});
                return resolve({ error : false , data : removeCategory });
            } catch ( error ) {
                return resolve({ error : true , message : error.message });
            }
        })
    }

/*
        UPDATE CATEGORY INTO DATABASE MONGODB 
*/

    static update({ id , title , description , avatar }){
        return new Promise(async resolve =>{
            try {
                let updateCategory = await CATEGORY_COLL.findByIdAndUpdate({ _id:id },{ title , description , avatar });
                if( !updateCategory ) 
                {
                    return resolve({ error : true , message : 'can not update' });
                }
                 return resolve({ error : false, data : updateCategory });
            } catch ( error ) {
                return resolve({ error : true , message : error,message})
            }
        })
    }

/*
      SEARCH CATEGORY FROM DATABASE MONGODB 
*/

    static search( search ){
        return new Promise(async resolve =>{
            try {
                let dataSearch = await PROMOTION_COLL.find({
                    $or:[
                        {title: new RegExp(search,'i')}
                    ]
                })
                if(!dataSearch) 
                {
                    return resolve({ error : true , message : 'can not find'})
                }
                resolve({error : false , data : dataSearch})
            } catch ( error ) {
                return resolve({error: true , message : error.message})
            }
        })
    }

    static getCategoryWithPrice(id)
    {
        return new Promise(async resolve =>{
            try {
                let infoProduct= await PRODUCT_COLL.find({ category:id })
                    .populate('category')
                    .populate('promotion')
                if( !infoProduct ) return resolve({ error : true ,message : 'error'})
                    resolve({ error : false, data : infoProduct})
            } catch ( error ) {
                return resolve({ error: true, message : error.message})
            }
        })
    }
}
