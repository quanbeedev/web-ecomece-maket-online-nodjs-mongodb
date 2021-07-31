const { models, Model } = require('mongoose');
const { model } = require('../database/order');
const ORDER_COLL = require('../database/order');
const ObjectID= require('mongoose').Types.ObjectId;
constPRODUCT_COLL= require('../database/product')
const USER_COLL = require('../database/user');

module.exports= class order extends ORDER_COLL{
 /*
        REMOVE CATEGORY IN DATABASE MONGODB 
*/
    static insert({productsArr,total,address,note,pay,user}){
        return new Promise(async resolve =>{
            try {
                let products= [];
                productsArr.forEach( item => {
                    products.push(item.infoProduct._id)
                })
                let newoder= new ORDER_COLL({ products,total,address,note,pay,user})
                let infoOder= await newoder.save()
             
                if(!infoOder) return resolve({error: true, message:'not exist Order'})
                return resolve({error: false, data: infoOder})
            } catch (error) {
                return resolve({error: true, message: error.message})
            }
        })
    }

    static getListProductBestSeller(){
        return new Promise( async resolve=>{
            let listProduct = await ORDER_COLL.aggregate([{
                $unwind:"products"
            }])
            
        })
    }

    static getList(){
        return new Promise( async resolve =>{
            try {
                let listOrder = await ORDER_COLL.find()
                .populate('products')
                .populate('users')
                if(!listOrder) 
                    return resolve({error: true, message:'can not get list'})
              
                return resolve( { error: false, data: listOrder})
                
            } catch ( error ) {
                return resolve( { error : true, message : error.message})
            }
        })
    }

    static getInfo(id){
        return new Promise(async resolve => {
            try {
                let infoUser = await USER_COLL.findById(id);
                if(!infoUser){
                    return resolve({error: true, message:'not_found_infoUser'});
                }
                return resolve({error: false, message:'get_info_success'});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static update({id, name, phone, email, sex}) {
        return new Promise(async resolve => {
            try {
               
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }
                let listUser = await USER_COLL.findByIdAndUpdate(id,{
                    name, phone, email, sex
                }
                ,{
                    new: true
                });
                
                if(!listUser){
                    return resolve({error: true, message:'cannot_update_list'});
                }
                return resolve({error: false, message:'update_data_success', data: listUser});


            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove(id){
        return new Promise(async resolve => {
            try {
                let listUserForRemove = await ORDER_COLL.findByIdAndDelete(id);
                if(!listUserForRemove.errors)
                return resolve({error: false, data:listUserForRemove});
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static signIn(username, password){
        return new Promise(async resolve => {
            try {
                let infoUser = await USER_COLL.findOne({username});

                if(!infoUser){

                    return resolve({ error: true, message: 'user_not_exist' });
                }

                let passwordInfo = infoUser.password

                const checkPass = await compare(password, passwordInfo);
                // console.log({checkPass});

                if(!checkPass){
                    return resolve({ error: true, message: 'password_not_exist' });
                }
                await delete infoUser.password;
                let token = await sign({data:infoUser});
                // console.log({token});
                return resolve({ error: false, data: { infoUser, token } });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}