const { resolve } = require('path');
const { decode } = require('querystring');
const PROMOTION_COLL= require('../database/promotion');
const { renderToView } = require('../utils/checkRouting');
const ObjectID = require('mongoose').Types.ObjectId;
const {uploadMulter}      = require('../utils/config_multer')

module.exports= class promotion extends PROMOTION_COLL{
    static insert({title,content,percent,avatar,status}){
        return new Promise(async resolve =>{
            try {
                let checkExist= await PROMOTION_COLL.findOne({title});

                if(checkExist)
                    return resolve({error: true, message: 'exist Promotion'});
                let newpromotion = await PROMOTION_COLL({ title,content,percent,avatar,status});
                // console.log({newpromotion})
                let infoPromotion= await newpromotion.save();
                if(!infoPromotion) return resolve({error: true, message:'can not insert'});
                resolve({error: false, data: infoPromotion})
            } catch (error) {
                return resolve({error: true, message: error.message})
            }
        })
    }
    static getList(){
        return new Promise(async resolve =>{
            try {
                let infoPromotion= await PROMOTION_COLL.find();
                if(!infoPromotion) return resolve({error: true,message:'can not getlist'})
                return resolve({error:false,data:infoPromotion})
            } catch (error) {
                return resolve({error: true,message:error.message})
            }
        })
    }
    static getId({id}){
        return new Promise(async resolve =>{
            try {
                let  infoPromotion= await PROMOTION_COLL.findById(id);
            if(!infoPromotion) return resolve({error: true, message: 'not exist'});
            return resolve({error: false, data:infoPromotion})
            } catch (error) {
                return resolve({error: true, message: error.message})
            }
        })
    }
    static update({id,title,content,percent,avatar,status})
    {
        return new Promise(async resolve =>{
            try {
                let checkExist = await PROMOTION_COLL.findOne({title});
                if(checkExist) return resolve({error: true, message:'exist'});
                let infoPromotion = await PROMOTION_COLL.findByIdAndUpdate({_id:id},{title,content,percent,avatar,status})
                if(!infoPromotion) return resolve({error: true,message:'can not update'});
            resolve({error: false, data: infoPromotion})
            } catch (error) {
                return resolve({error: true, message:error.message})
            }
        })
    }
    static remove({id}){
        return new Promise(async resolve=>{
            try {
                let deletePromotion= await PROMOTION_COLL.findByIdAndDelete(id);
                if(!deletePromotion) return resolve({error: true, message:'can not remove'});
                resolve({error: false, data: deletePromotion})
                
            } catch (error) {
            return resolve({error:true, message: error.message})
            }
        })
    }
    static seach(seach){
        return new Promise(async resolve=>{
            
        })
    }

}