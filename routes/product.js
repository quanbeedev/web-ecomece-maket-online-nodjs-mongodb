const route= require('express').Router();
const PRODUCT_MOD= require('../models/product');
const {uploadMulter}= require('../utils/config_multer');
const {renderToView} = require('../utils/checkRouting');
const ROLE_ADMIN= require('../utils/checkRole');
const CATEGORY_MOD= require('../models/category');
const PROMOTION_MOD= require('../models/promotion');
const ORDER_MOD= require('../models/order');
const PRODUCT_COLL = require('../database/product');
const ObjectID = require('mongoose').Types.ObjectId;
const { info } = require('toastr');
const { Template } = require('ejs');
const { findById } = require('../database/product');
const data = require('moment')
const jwt              = require('../utils/jwt');
//Apriori 
const ItemsetCollection = require('../apriori/itemSetCollection');
const Itemset = require('../apriori/itemSet');
const AprioriMining = require('../apriori/aprioriMining');


route.get('/them', async (req,res)=>{
    let category= await CATEGORY_MOD.getList()
    let promotion= await PROMOTION_MOD.getList()
    //renderToView('dashboard/pages/add-product')
     renderToView(req,res,'dashboard/pages/add-product',{})
})
let cpUpload = uploadMulter.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 5 }])
route.post('/add',cpUpload,async (req,res)=>{
     let infofile = req.files;
    let {title,description, slug, price, amount,category,promotion,status} = req.body;
    let infoProduct = await PRODUCT_MOD.insert({title,description,slug,price,amount,avatar: infofile.avatar.avatar,gallery: infofile.gallery,category,promotion,status})
    // console.log(infoProduct)
    if(!infoProduct.error) res.json({infoProduct})
})
route.get('/list', async (req,res)=>{
    renderToView(req,res,'dashboard/pages/list-product',{})
})

route.get('/remove-cart/:id', async (req, res) => {
    let {id} = req.params;
    // let cart = new CART_MODEL(req.session.cart ? req.session.cart: {});
    // console.log({cart});
    
    cart.removeItem(id);
    req.session.cart = cart;
    res.json({data: cart.generateArray()})
})

route.post('/find-product-for-qickView/:id', async (req,res) =>{
    let {id} = req.params;
    let {userID}= req.body;
  
    // console.log({id})
    let inforProductForQickView = await PRODUCT_MOD.getId(id,userID);
    // console.log({inforProductForQickView})
    res.json(inforProductForQickView)
})
route.get('/get-list-by-length',async ( req, res )=>{
    let { lengthProduct } = req.query;
    let infoProduct = await PRODUCT_MOD.getListByLengthProduct({lengthProduct})
    return res.json(infoProduct.data)
})
route.get('/:id?',async (req,res)=>{
    let {id} =req.params;
    let inforProduct= await PRODUCT_MOD.getId({id})
    if(!inforProduct) return res.json({inforProduct})
    res.json(inforProduct.data)
})
route.post('/remove/:id',async (req,res)=>{
    let{id}= req.params;
    let{category,promotion}= req.body
    console.log({id,category,promotion})
    let infoProduct = await PRODUCT_MOD.remove({id,category,promotion});
    if(!infoProduct) res.json({infoProduct});
    res.json(infoProduct.data)
})
route.get('/edit/:id',async (req,res)=>{
    let {id} = req.params;
    let result = await PRODUCT_MOD.getId(id)
    
    renderToView(req,res ,'dashboard/pages/edit-product',{result:result.data})
    // res.render('dashboard/pages/edit-product',{})
})


route.post('/update', cpUpload, async (req,res)=>{
    let { id } = req.query;
    // console.log({id});
    let infofile = req.files;
    let {title, description, slug , price, amout, categoryProduct, promotionProduct, status} = req.body;
    console.log({description})
    // console.log({title,price,amout,categoryProduct,promotionProduct,status})
    
    let infoProduct= await PRODUCT_MOD.update({id,title,description,slug,price,amout,categoryProduct,promotionProduct,avatar: infofile.avatar, gallery: infofile.gallery, status});
    if(!infoProduct.error) res.json({infoProduct})
    res.json(infoProduct.data)
})

/*
=======================XÓA SẢN PHẨM VÀO GIỎ HÀNG====================
 */

route.post('/pull-product-from-session', async( req , res ) => {
    let { id } = req.query;
    console.log({idProduct:id});
    if( req.session.cart && req.session.cart.length > 0){
        let result = false;
        indexFinded = 0;
            req.session.cart.forEach( (element, index ) => { 
                if(id == element.infoProduct._id){
                    result = true;
                    indexFinded = index;
                }
                return;
            })
        if(result == true){
            req.session.cart.splice(indexFinded, 1);
        }
    }
    res.json({data : req.session.cart});
    console.log({cart : req.session.cart})
})


/*
=======================THÊM SẢN PHẨM VÀO GIỎ HÀNG====================
 */

route.post('/get-infor-product-to-session',async(req,res)=>{
    let {id}= req.query;
    // req.session.cart = [];  
    let checkExist = await PRODUCT_COLL.findById(id)
    .populate('promotion')
    // console.log(checkExist);
    
    let infoProduct = {};
//    Them San Pham vao cart trong sesion
    if(req.session.cart && req.session.cart.length > 0 ){ 
            let result = false;
            let indexFinded = 0;
            req.session.cart.forEach((element, index) => {
                if(element.infoProduct._id == id){
                    result = true;
                    indexFinded = index;
                    return;
                }
            });
            // console.log({ result, indexFinded });
            if( result == true ){
                req.session.cart[indexFinded].qty +=1;
                if(req.session.cart[indexFinded].infoProduct.promotion){
                    aa = (req.session.cart[indexFinded].infoProduct.price - req.session.cart[indexFinded].infoProduct.price * req.session.cart[indexFinded].infoProduct.promotion.percent /100) * req.session.cart[indexFinded].qty; 
                }else{
                    aa = req.session.cart[indexFinded].infoProduct.price  * req.session.cart[indexFinded].qty; 
                }
                req.session.cart[indexFinded].total = aa;
            }else{
                // console.log("da do day");
                infoProduct.infoProduct = checkExist;
                infoProduct.qty = 1;
                let aa = 0;
                if(checkExist.promotion){
                    aa = (checkExist.price - checkExist.price * checkExist.promotion.percent /100) * infoProduct.qty; 
                }else{
                    aa = checkExist.price  * checkExist.qty; 
                }
                infoProduct.total = aa;
                // console.log({ infoProduct });
                req.session.cart.push(infoProduct)
            }
    } else {
        infoProduct.infoProduct = checkExist;
        infoProduct.qty = 1;
        let aa = 0;
            if(checkExist.promotion){
                aa = (checkExist.price -  checkExist.price*checkExist.promotion.percent /100 ) * infoProduct.qty; 
            }else{
                aa = checkExist.price * infoProduct.qty; 
            }
            infoProduct.total = aa;
        req.session.cart.push(infoProduct)
    }

    let _db = [];
    let arr = await ORDER_MOD.getList();
    // console.log({arr:  arr .data});
    let arrItem =[];
    if( arr.data && arr.data.length ){
        arr.data.forEach( item =>{
            let arra = [];
            item.products.forEach(element =>{
                // console.log(element._id);
                arra.push( element._id );        
            })
            arrItem.push(arra.toString());  
            // console.log("==========")
        })
    }
    // console.log(arrItem);

    let db = new ItemsetCollection();
    arrItem.forEach(i => _db.push(i));
    
    for (var i in _db) {
        let items = _db[i].split(',');
        //tach string thanh array

        db.push(Itemset.from(items)); // dua taon bo id vao phan tich
    }
    //_db la full id cua san pham
    // Step1: Find large itemsets for given support threshold
    let supportThreshold = parseFloat('20');

    // console.log({ supportThreshold });
    let L = AprioriMining.doApriori(db, supportThreshold);
    // console.log({ L });

    // Step2: Build rules based on large itemsets and confidence threshold
    let confidenceThreshold = parseFloat(50);
    let allRules = AprioriMining.mine(db, L, confidenceThreshold);
    console.log({allRules})
    let arrrItem = [];
    let indexY = [];
    let arrItemHasConfBest = [];
    let productHasConfBest = [];

    allRules.forEach(async (itemAss, index)  => {
        let stringItem = "";
        if ( itemAss.X.length == 1 && itemAss.X[0] == id)
        { 

            for(let i = 0; i < itemAss.X.length; i++)
            {
                stringItem += `${index}_${itemAss.X[i]}_`;
            }

            // console.log({ stringItem });
            let indexOfString = stringItem.indexOf("_");
            let item = stringItem.substring(0, indexOfString);
            // console.log({ item })
        //   console.log(req.session.cart);
            for( let Y of itemAss.Y)
            {  
                arrrItem[arrItem.length] = Y;
                let i = 0;
                if( ! (arrrItem[arrItem.length] in indexY) )
                {
                    if( !indexY.includes(arrrItem[arrItem.length]))
                    {
                         indexY.push(arrrItem[arrItem.length])  
                    }
                }
            }
        }
    })

    console.log({ Y : indexY});
    // console.log({ cart : req.session.cart })
    for( id of indexY)
    { 
            let userID
            let infoProductOfArr = await PRODUCT_MOD.getId(id , userID)
            productHasConfBest.push(infoProductOfArr.data);    
    }
    for(index of req.session.cart )
    {
        for( let i = 0; i < productHasConfBest.length ; i++)
        {
            // console.log("================================");
            // console.log({X : productHasConfBest[i]._id });
            // console.log({ index: index.infoProduct._id });
            if( productHasConfBest[i]._id == index.infoProduct._id )
            {
                // console.log("dung roi");
                productHasConfBest.splice(i, 1);
            }
        }
    }
    console.log({ productHasConfBest });
    let { token } = req.session;
    let infoUser;
    if( token )
    {
        infoUser = await jwt.verify( token )
    }
    // data.productHasConfBest = productHasConfBest.data;
    return res.json({ data: req.session.cart ,infoUser, dataRecomend : productHasConfBest })
})
/*
=====================Tru san Pham=======================

*/

route.post('/minus-product-from-cart', (req, res) =>{
    let{id} = req.query;
    // console.log({id});
    let cart = req.session.cart;
    // console.log({cart});
    if(cart && cart.length > 0){
        let result = false;
        let indexNumber = 0;
        cart.forEach( (element, index ) =>{
            if( id == element.infoProduct._id)
            {
                result = true;
                indexNumber= index;
                return;
            }
        });

        if(result == true){
            cart[indexNumber].qty -= 1;
            let price = 0;
            if(cart[indexNumber].infoProduct.promotion){
                price = cart[indexNumber].infoProduct.price - (cart[indexNumber].infoProduct.price*cart[indexNumber].infoProduct.promotion.percent / 100);
            } else {
                price = cart[indexNumber].infoProduct.price
            }
            cart[indexNumber].total = cart[indexNumber].total - price ;
            if(  cart[indexNumber].qty == 0 ){
                 cart.splice( indexNumber, 1);
            }
            // cart.splice( indexNumber, 1)
        }
    }
    res.json({data: req.session.cart})
})


route.post('/search-price',async (req,res)=>{
    let {id} = req.query;
    // console.log({id});
    let {startPrice, endPrice, promotionID} = req.body;
    // console.log({startPrice,endPrice , promotionID})
    let listProduct;
    if(ObjectID.isValid(id) && !ObjectID.isValid(promotionID))
        {
            listProduct = await PRODUCT_MOD.getPriceWithCategory(id,startPrice,endPrice)
     }else if(ObjectID.isValid(id) && ObjectID.isValid(promotionID))
        {
            listProduct= await PRODUCT_MOD.getPriceWithCategoryAndPromotion(id,startPrice,endPrice,promotionID)
    }else if(!ObjectID.isValid(id) && ObjectID.isValid(promotionID)){
            listProduct= await PRODUCT_MOD.getProductWithPromotion(promotionID, startPrice, endPrice)
    }else{
            listProduct = await PRODUCT_MOD.getListProductForPrice(startPrice,endPrice)
    }
    res.json({listProduct: listProduct.data});
})
module.exports = route