const PRODUCT_COLL= require('../database/product');
const ObjectID= require('mongoose').Types.ObjectId;
const CATEGORY_COLL=require('../database/category');
const PROMOTION_COLL=require('../database/promotion');
const { resolve } = require('path');
const category = require('./category');
const { start } = require('repl');
const USER_COLL = require('../database/user')

module.exports= class product extends PRODUCT_COLL{
    static insert({title,description, slug,price,amount,avatar,category,gallery,promotion,status}){
        return new Promise(async resolve =>{
            try {
                console.log(avatar)
             let checkExist= await PRODUCT_COLL.findOne({title})
             let b=[]
                gallery.forEach( async item=>{
                   b.push(item.originalname)
                 
                  })
                  console.log(b)
            if(checkExist) return resolve({error: true,message:'exist'})
            let newProduct
            function string_to_slug(str) {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();
              
                // remove accents, swap ñ for n, etc
                var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
                var to   = "aaaaeeeeiiiioooouuuunc------";
                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }
            
                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-') // collapse whitespace and replace by -
                    .replace(/-+/g, '-'); // collapse dashes
            
                return str;
            }
            let a = string_to_slug(slug);
            console.log(a)
            if(ObjectID.isValid(promotion))
            {
                newProduct= await PRODUCT_COLL({title,description,slug:a,price,amount,avatar,category,gallery : b,promotion,status})
        
            }else{
                newProduct= await PRODUCT_COLL({title,description,slug:a,price,amount,avatar,category,gallery : b,status})
            }
     
            let infoProduct= await newProduct.save();
            if(!infoProduct) return resolve({error: true, message:'canot insert'})
            let {_id:productID} = infoProduct;
             infocategory= await CATEGORY_COLL.findByIdAndUpdate(category,{
                 $addToSet:{
                    products: productID
                 }
             })
             if(ObjectID.isValid(promotion)){
                 infoPromotionUpdate= await PROMOTION_COLL.findByIdAndUpdate(promotion,{
                     $addToSet:{
                         products:productID
                     }
                 })
             }
             if(!infocategory) return resolve({error:true,message:'cannot update category'})
             return resolve({error:false,data:infoProduct})
            } catch (error) {
                return resolve({error:true, message:error.message})
            }
        })
    }
    static getList(){
        return new Promise(async resolve=>{
            try {
                
                let infoproduct = await PRODUCT_COLL.find().limit(15)
                    .populate('category')
                    .populate('promotion')
                if(!infoproduct) return resolve({ error: true,message:'can not getlist'})
               return resolve({ error: false, data: infoproduct})
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        })
    }
    static getListByLengthProduct({lengthProduct}){
    return new Promise( async resolve=>{
        try {
            let infoProduct = await PRODUCT_COLL.find()
                .skip(Number(lengthProduct))
                .limit(5)
                .populate('category')
                .populate('promotion')
            if( !infoProduct ) 
                return resolve({error: true, message:'can not get list'});
            return resolve({ error:false, data: infoProduct })
        } catch (error) {
            return resolve({ error: true, message:error.message })
        }
    })
    }
    static getId(id,userID){
        return new Promise( async resolve =>{
            try {    
                let checkExist = await PRODUCT_COLL.findById({_id:id})
                .populate('category')
                .populate('promotion')
                if(!checkExist)  
                {
                    return resolve({error: true,message:'can not get list'})
                }
                
                // let inforProduct = await PRODUCT_COLL.findById(id)
                if(userID){
                let infoUpdate= await USER_COLL.findByIdAndUpdate(userID,{
                        $addToSet:{
                            seen: id
                        }
                    })
                }
                resolve({error:false, data: checkExist})
            } catch (error) {
                return resolve({error: true, message:error.message})
            }
        })
    }
    static remove({id,category,promotion}){
        return new Promise(async resolve=>{
            try {
                let checkExist= await PRODUCT_COLL.findById({id})
                if(!checkExist) return resolve({error: true, message:'not exist'})
                resolve({error: false, data: checkExist})
                let infoProduct = await PRODUCT_COLL.findByIdAndDelete({id})
                let infocategory= await CATEGORY_COLL.findByIdAndUpdate(category,{
                    $pull:{
                        products : id
                    }
                })
                if(ObjectID(promotion)){
                    let infoPromotion= PROMOTION_COLL.findByIdAndUpdate(promotion,{
                        $pull:{
                            promotion:id
                        }
                    })}
                
            } catch (error) {
                return resolve({error:true, message: error.message})
            }
        })
    }
    static searchProduct(keyword){
        return new Promise(async resolve=>{
            try {
                console.log(keyword)
                let dataSeach = await PRODUCT_COLL.find({
                    $or:[
                        { title: new RegExp( keyword, 'i') },
                    ]
                    
                })
                .populate('promotion')
                // console.log({dataSeach})
                if(!dataSeach) return resolve({error: true, message:error.message})
                resolve({error:false, data: dataSeach})
            } catch (error) {
                return resolve({error: true,message:error.message})
            }
        })
    }
    //filter theo gia thuoc id category
    static getPriceWithCategory(id,startPrice,endPrice){
        return new Promise(async resolve=>{
            try {
                let listProduct= await PRODUCT_COLL.find({category:id})
                .populate('category')
                .populate('promotion')
                if(!listProduct){return resolve({error: true, message:'can not get list'})}
                let arrProduct =[];
                listProduct.forEach(item =>{
                    if(item.promotion)
                    {
                        let a= item.price - item.price * item.promotion.percent/100;
                        if( a>=Number(startPrice)&&a<= Number(endPrice) )
                        arrProduct.push(item);
                    }else{
                        if( item.price >=Number(startPrice)&& item.price <= Number(endPrice))
                        arrProduct.push(item);
                    }
                })
                // console.log({arrProduct})
                if(!listProduct) return resolve({error: true, message:'can not get listProduct with category'})
                return resolve({error: false, data:arrProduct})
            } catch (error) {
                return resolve({error:true,message:error.message})
            }
        })
    }
    static getPriceWithCategoryAndPromotion(id,startPrice,endPrice,promotionID)
    {
        return new Promise(async resolve =>{
            try {
                let listProduct= await PRODUCT_COLL.find({
                    category:id,
                    promotion:promotionID,
                })
                .populate('category')
                .populate('promotion')
                if(!listProduct) return resolve({error: true, message:'can not get list product with category and protoon'})
                let arrProduct = [];
                listProduct.forEach(item=>{
                    if(item.promotion)
                    {
                        let a= item.price-(item.price*item.promotion.percent/100)
                        if(a.price<=Number(endPrice) && a.price>=Number(startPrice))
                            arrProduct.push(item);
                    }
                    else{
                        if(item.price >=Number(startPrice) && item.price<= Number(endPrice))
                            arrProduct.push(item);
                    }
                })
                if(listProduct) return resolve({error: true,message:'cannot get list'})
                resolve({error: false, data: listProduct.data})
            } catch (error) {
                return resolve({error: true, message: error.message})
            }
        })
    }
    static getListProductForPrice(startPrice,endPrice){
        return new Promise(async resolve =>{
           try {
            let listProduct = await PRODUCT_COLL.find({})
            .populate('category')
            .populate('promotion')
            if(!listProduct) return resolve({error: true , message: 'can not get list'})
            let arrProduct = [];
            if(listProduct && listProduct.length>0){
                listProduct.forEach(item=>{
                    if(item.promotion){
                    let a = item.price-item.price*item.promotion.percent/100
                    if(a>= Number(startPrice) && a<= Number(endPrice))
                    {
                             arrProduct.push(item);
                    }
                    }else{
                        if(item.price>=Number(startPrice) && item.price <= Number(endPrice) )
                        arrProduct.push(item)
                    }

                });
            }

         return resolve({error: false , data: arrProduct})
           } catch (error) {
               return resolve({error: true , message: error.message})
           }

        })
    }
    static getProductWithPromotion(promotionID,startPrice,endPrice){
        return new Promise(async resolve =>{
            try {
                
                let listProduct= await PRODUCT_COLL.find({
                    promotion:promotionID
                })
                if(!listProduct) return resolve({error: true,message:'can not get list'});
                let arrProduct =[];
                listProduct.forEach(item=>{
                    if(item.promotion)
                    {
                        let a= item.price - item.price*item.promotion.percent/100
                        if(a>=startPrice && a<= endPrice)
                        {
                            arrProduct.push(item)
                        }
                    }
                return resolve({error: false, data: arrProduct})
                })
            } catch (error) {
                return resolve({error: true , message: error.message})
            }
        })
    }
    static update({id,title,description,slug,price,amout,categoryProduct,promotionProduct,avatar, gallery, status}){
        return new Promise(async resolve=>{
            try {
                console.log({id,title,description,slug,price,amout,categoryProduct,promotionProduct,avatar, gallery, status})
               let infoProductAfterUpdate
               let a=[]
                gallery.forEach( async item=>{
                   a.push(item.originalname)
                 
                  })
                  function string_to_slug(str) {
                    str = str.replace(/^\s+|\s+$/g, ''); // trim
                    str = str.toLowerCase();
                  
                    // remove accents, swap ñ for n, etc
                    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
                    var to   = "aaaaeeeeiiiioooouuuunc------";
                    for (var i=0, l=from.length ; i<l ; i++) {
                        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                    }
                
                    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                        .replace(/\s+/g, '-') // collapse whitespace and replace by -
                        .replace(/-+/g, '-'); // collapse dashes
                
                    return str;
                }
                let b = string_to_slug(slug);
                
                // if( avatar == undefined && gallery ==un ){
                //     console.log("hello")
                    infoProductAfterUpdate = await PRODUCT_COLL.findByIdAndUpdate( id,{ title,description, slug : b , price , amout , status }) 
                    
                // } else {
                //     infoProductAfterUpdate = await PRODUCT_COLL.findByIdAndUpdate( id,{ title ,description, slug : b , price , amout ,avatar, gallery:a, status} ) }
                 
                let inforCategoryAfterUpdate = await PRODUCT_COLL.findByIdAndUpdate(id,{
                   $set: {
                        categoryProduct : category
                    }
                })
                let inforPromotionAfterUpdate = await PRODUCT_COLL.findByIdAndUpdate(id,{
                    $set: {
                         promotionProduct : promotion
                     }
                 })
                if(!infoProductAfterUpdate)
                    return resolve({error: true, message: 'can not update'})
                return resolve({error: false, data: infoProductAfterUpdate})
            } catch (error) {
                return resolve({error: true , message: error.message})
            }
        })
    }
    
}