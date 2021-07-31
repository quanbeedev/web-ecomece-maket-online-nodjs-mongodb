const { sign , verify } = require('../utils/jwt')
module.exports = async function(req, res, next) {
    // let token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNleCI6MCwicm9sZSI6MSwiX2lkIjoiNWZlMmJhM2EzYmYzYmYzNGYwZWNhODY3IiwibmFtZSI6IkzDqiBQaMaw4bubYyBTxqFuIiwidXNlcm5hbWUiOiJuZ3V5ZW5xdWFuaG9uZyIsInBhc3N3b3JkIjoiJDJiJDA4JEdHR2JGLjFPNWh2R0xoOS9lRjV0ZE9rdUs3dTNQZmhJYTV1WnI5SWJodXU1Y0JpdldMekV1IiwiZW1haWwiOiJxdWFuaG9uZ0BnbWFpbC5jb20iLCJfX3YiOjB9LCJpYXQiOjE2MDg3Mjk0MTB9.5xXqbjGCPvyjCJHG8Li-8eLrM_UqhaapLqmemVtNmTg'
    let { token } = req.session;
    if(!token){
        return res.redirect('/admin/login');
    }
    let checkRole = await verify(token);
    if(checkRole.data.role !=1 )
        return res.redirect('/customers');
        next();

}