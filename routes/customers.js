const route = require('express').Router();

const { CF_ROUTING }   = require('../constant/core/base_ipi');
const { renderToView } = require('../utils/checkRouting')
const path             = require('path');
const fs               = require('fs');
const jwt              = require('../utils/jwt');

const CATEGORY_COLL    = require('../database/category');
const CATEGORY_MOD     = require('../models/category');
const PRODUCT_COLL     = require('../database/product');
const PRODUCT_MOD      = require('../models/product');
const { render }       = require('ejs');
const ORDER_MOD        = require('../models/order');
const USER_MOD         = require('../models/user');
const user             = require('../database/user')
const CHECKROLE        = require('../utils/checkRole');

const { authenticate } = require('passport');
const passport         = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const facebook         = require('../database/facebook')
const googleStrategy   = require('passport-google-oauth20').Strategy
const FACEBOOK_COL     = require('../database/facebook');

const { profile }      = require('console');
route.use(passport.initialize());

/*
    OPEN PAGES HOME 
*/
route.get(CF_ROUTING.HOME, async (req, res) =>{

    renderToView(req, res, 'pages/customers',{})
   
    })


/*
    RANDERPAGE REGISTER FOR CUSTOMERS
*/

route.get( CF_ROUTING.REGISTER, async ( req, res) =>{
   renderToView( req, res, 'pages/sign-up', { })
})

/*
    GET INFO NEW CUSTOMERS AND INSERT INFOMATION TO DATABASE
*/

route.post(CF_ROUTING.REGISTER, async ( req, res) =>{
    let{ name, username, password, email} =  req.body;
    // console.log({ body: req.body})
    let inforNewUser = await USER_MOD.insertNewUserToDatabase({ name, username, password, email });
    if( inforNewUser.error ){
        return res.json( inforNewUser )
    } 
   
    return res.json({ inforNewUser : inforNewUser.data})
    
})
/*
    RANDER PAGE LOGIN 
*/
route.get(CF_ROUTING.LOGIN, async ( req, res) =>{
    renderToView( req, res, 'pages/sign-in' , {})
})

route.post( CF_ROUTING.LOGIN , async ( req, res) =>{
    let { username, password } = req.body;
    console.log({ username, password})
    let infoUserForSingIn = await USER_MOD.singIn({ username, password});
    
    if( infoUserForSingIn.error ){
        return res.json( infoUserForSingIn )
    }
    /*
        PUSH TOKEN TO SESSION 
    */
    req.session.token = infoUserForSingIn.data.token; 
    req.session.user = infoUserForSingIn.data; 
     /*
        CREATE CART ARR FOR NEW SESSION
    */
    req.session.cart = [];
    res.json({ infoUserForSingIn })
})

/*
        RANDER PAGE SHOP TO VIEW
*/

route.get('/shop',async (req,res)=>{
    renderToView( req, res, 'pages/shop',{ })
})

/*
        GET ID CATEGORY AND LIST PRODUCT AND LIST SEARCH 

*/

route.get( '/danh-sach-san-pham' ,async ( req, res) =>{
    let { id } = req.query;
     if ( id ){
        let infoCategory = await CATEGORY_MOD.getId({ id });
        let infoProduct = await CATEGORY_MOD.getCategoryWithPrice( id );
        renderToView( req, res , 'pages/shop', { infoCategory : infoCategory.data , infoProduct:infoProduct.data , listSeachProduct : null})
    } else if( !id ){
        let { keyword }  = req.query;
        let listSeachProduct = await PRODUCT_MOD.searchProduct( keyword );
         renderToView(req,res,'pages/shop',{ infoCategory:null , infoProduct: null, listSeachProduct : listSeachProduct.data })
     }
    
})

/*
        GET ID FOR PRODUCT DETAIL
*/

route.get('/chi-tiet-san-pham', async(req, res) =>{
    let { id } = req.query;
        let infoProduct = await PRODUCT_MOD.getId( id )
        if(!infoProduct.error) 
            renderToView(req,res,'pages/detail-product',{infoProduct:infoProduct.data})
})

/*   
    LOGOUT
*/

route.get(CF_ROUTING.LOG_OUT, async (req, res) => {
    req.session.token = undefined;
    res.redirect('/customers');
})

/*   
        RANDER PAGE CART
*/

route.get( '/cart' ,async( req, res) =>{
    renderToView(req, res, 'pages/cart', {})
})
/*   
        RANDER PAGE CHECKOUT
*/
route.get( '/checkout', async( req, res) =>{
    let { token } = req.session;
    let infoUser;
    if( token )
    {
        infoUser = await jwt.verify( token )
    }

    renderToView( req, res, 'pages/checkout', { infoUser: infoUser.data})

})

/*   
        RANDER PAGE CHECKOUT
*/

 route.post('/checkout', async( req, res) =>{
        let{ id } = req.params;
        let { token }= req.session;
        let infoUser;
        if( token )
        {
            infoUser = await jwt.verify(token)
        }
        let productsArr = req.session.cart
        let {name, phone, email, address, sex ,note, total, pay} = req.body;
        // console.log({name, phone, email, address, sex ,note, total, pay})
        let infoOrder = await ORDER_MOD.insert({ productsArr, total, address, note, pay, user:infoUser.data._id})
        res.json({infoOrder});
})

/*   
        LOGIN FACEBOOK
*/

passport.use(new facebookStrategy({

    clientID        : "147241727261197",
    clientSecret    : "fce017c3c3353dc3d6a8c3c2abeef6ca",
    callbackURL     : "http://localhost:3000/customers/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
         facebook.findOne({ 'uid' : profile.id }, 
        function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new facebook();

                // set all of the facebook information in our user model
                newUser.uid    = profile.id; // set the users facebook id                   
                newUser.token = token; // we will save the token that facebook provides to the user                    
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.gender = profile.gender
                newUser.pic = profile.photos[0].value
                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }

        });

    })

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    facebook.findById(id, function(err, user) {
        done(err, user);
    });
});

route.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
route.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/checkout',
			failureRedirect : '/'
		}));

/*   
        LOGIN GOOGLE
*/
passport.use(new googleStrategy({
    clientID: "585150215499-v7cp343hvamku6ddgdjcu7rb195lltdb.apps.googleusercontent.com",
    clientSecret:"asF3eCg6M79MKQIOpp8cNd-Y",
    callbackURL: "http://localhost:3000/customers/google/callback"
 },
    function(acesstoken, refreshToken, profile, done) {
        process.nextTick(function() {

            // find the user in the database based on their facebook id
             facebook.findOne({ 'uid' : profile.id }, 
            function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
    
                // if the user is found, then log them in
                if (user) {
                    console.log("user found")
                    console.log(user)
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new facebook();
    
                    // set all of the facebook information in our user model
                                                    
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.gender = profile.gender
                    newUser.pic = profile.photos[0].value
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
    
                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
    
            });
    
        })
    }
));

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
route.get('/google/callback', 
    passport.authenticate('google', {failureRedirect : '/customers/dang-nhap'}),
    function(req,res){
        console.log('thanh cong')
        res.redirect('/');
    });


module.exports = route;