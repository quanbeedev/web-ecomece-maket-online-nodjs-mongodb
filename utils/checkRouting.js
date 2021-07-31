const jwt               = require('./jwt');
const moment            = require('moment');
const CATEGORY_COLL       = require('../models/category');
const PRODUCT_COLL       = require('../models/product');
const PROMOTION_COLL       = require('../models/promotion');
const ORDER_COLL       = require('../models/order');
const PRODUCT_MOD  = require('../models/product');


let renderToView = async function(req, res, view, data) {
    let { token } = req.session;

    let cartArr = req.session.cart;  
    if(!cartArr){
        data.cartArr = undefined;
    }else{
        data.cartArr = cartArr
    }
    let listProduct = await PRODUCT_COLL.getList();
    let listOrder = await ORDER_COLL.getList();
    let listCategory = await CATEGORY_COLL.getList();
    let listPromotion = await PROMOTION_COLL.getList();
    if(token) {
        let user = await jwt.verify(token);
        data.infoUser = user.data;
    } else {
        data.infoUser = undefined;
    }
    data.moment         = moment;
    data.listProduct    = listProduct.data;
    data.listOrder    = listOrder.data;
    data.listPromotion    = listPromotion.data;
    data.listCategory       = listCategory.data;

    // tim kiem san pham hot nhat
    let arrayOrder = await ORDER_COLL.getList();
    let arrayOrder1 = arrayOrder.data;
    let arrOrderForFile = [];
    if( arrayOrder1 && arrayOrder1.length > 0){
        arrayOrder1.forEach( item => {
                item.products.forEach( Element =>{
                    arrOrderForFile.push( Element._id);
                })   
        })
    }
    var counts = {};
    arrOrderForFile.forEach(
        function (x) {
            counts[x] = (counts[x] || 0)+1; 
        });
        // console.log({counts});
    keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
    // console.log(keysSorted);

    let arrBestSales = [];
    let value1 = 0;
    for (const [key, value] of Object.entries(counts)) {
        value1 = value1 + 1;
        if( value1 <= 4 )
        {
             arrBestSales.push(`${key}`);
        }
      }
        let productBestSalers = [];
        for (let id of arrBestSales){
            let userID
            let infoProductOfArr = await PRODUCT_MOD.getId(id , userID)
            productBestSalers.push(infoProductOfArr.data);
        }
        // console.log({data:productBestSalers})  
        data.productBestSalers = productBestSalers;    
        // console.log({b : data.productBestSalers })
    return res.render(view, data);
}
exports.renderToView = renderToView;     