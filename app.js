const express    = require('express');
const mongoose   = require('mongoose');
const app        = express();
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const paypal = require('paypal-rest-sdk');
const fs=require('fs');
var path=require('path');
const {renderToView} = require('./utils/checkRouting')
const exphdbs=require('express-handlebars');


//ROUTE
const ORDER_ROUTE = require('./routes/oders')
const CUSTOMER_ROUTE= require('./routes/customers')
const DASHBOARD_ROUTE= require('./routes/dashboard')
const USER_ROUTE= require('./routes/users')
const CATEGORY_ROUTE= require('./routes/categorys')
const PROMOTION_ROUTE= require('./routes/promotion')
const PRODUCT_ROUTE= require('./routes/product')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views/');

app.use(expressSession({
    secret: 'Cho online',
    saveUninitialized: true,
    resave:true,
    cookie:{
        maxAge: 10*60*1000
    }
}))

// Route
app.use('/customers', CUSTOMER_ROUTE);
app.use('/admin',DASHBOARD_ROUTE);
app.use('/users',USER_ROUTE);
app.use('/categorys',CATEGORY_ROUTE);
app.use('/promotions',PROMOTION_ROUTE);
app.use('/products',PRODUCT_ROUTE);
app.use('/orders',ORDER_ROUTE)
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
    secret:"thisissecretkey",
    saveUninitialized: false,
    resave: false,
    cookie:{
        secure: false,
        httpOnly: true,
        maxAge: 10 * 60 * 1000 * 100
    }
}));
// app.use(function (req, res, next) {
//     if (!req.session.views) {
//       req.session.cart = []
//     }
   
//     next()
//   })

app.get('/', async(req,res)=>{
  res.redirect('/customers')
})


let uri = 'mongodb://localhost:27017/webbanhang'
mongoose.connect(uri,{ useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true});

mongoose.connection.once('open' , () => {
    app.listen(3000, () => console.log( 'Server start at port 3000'));
})

