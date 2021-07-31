const jwt = require('jsonwebtoken');
const SECRET_KEY = 'adhsbhdvadfraaifjisjijiaj';

function sign(obj)
{
    return new Promise((resolve, rejects) =>{
        jwt.sign(obj,SECRET_KEY,(err, token) =>{
            if(err) return rejects(err)
            return resolve(token)
        })
    })
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return reject(err)
            return resolve(decode)
        })
    })
}

module.exports = {sign , verify};