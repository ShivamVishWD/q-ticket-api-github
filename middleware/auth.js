const jwt = require('../helper/jwt_helper')
const connectedAppModel = require('../models/connectedAppModel');


const sessionCheck = function (req, res, next) {
    
    const ss  = req.session;

    res.locals.authToken = ss.authToken;
    res.locals.adminEmail = ss.adminEmail;
    res.locals.adminId = ss.adminId;
    res.locals.adminPermission = ss.adminPermission;
    res.locals.adminRole = ss.adminRole;


    if(ss.adminEmail == undefined){
        res.redirect('/admin');
    }else{
        next();
    }
}

const VendorCheck = async (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) {
        return res.json({
            status: 403,
            message: 'MISSING_AUTH_TOKEN_KEY'
        });
    }
    if (!token.includes('Bearer ')) {
        return res.json({
            status: 403,
            message: 'MISSING_AUTH_BEARER_TOKEN_KEY'
        });
    }
    const getauthToken = token.replace('Bearer ', '');

    const st = await connectedAppModel.findOne({secret_key:getauthToken});
    if(st != null){
        next();
    }else{
        return res.json({
            status: 403,
            message: 'INVALID_AUTH_TOKEN'
        });
    }
 
}

module.exports = {sessionCheck,VendorCheck}