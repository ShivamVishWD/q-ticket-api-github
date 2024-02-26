const { HandleError } = require('../helper/ErrorHandler');
const token = require('../middleware/JWT');
const adminModel = require('../models/admin');
const bcrypt = require("bcrypt");

const collectionFields = {
    id: "_id",
    name: 'Name',
    email: 'Email',
    password: 'Password',
    active: "IsActive",
    delete: "IsDeleted",
    permission: "Permission",
    permissionType: "PermissionType"
}

const adminController = {

    get: async(req, res) => {
        try{
            let filterObj = {
                IsActive: true,
                IsDeleted: false
            };
            const result = await adminModel.find(filterObj);
            return res.status(200).json({status: 200, message: 'Records Fetched',  data: result});
        }catch(error){
            return HandleError(error);
        }
    },

    insert: async(req, res) => {
        try{
            if(!req.body && Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Request Body should not be empty'});

            let mandatoryFields = [];
            if(!req.body.name) mandatoryFields.push('name');
            if(!req.body.email) mandatoryFields.push('email');
            if(!req.body.password) mandatoryFields.push('password');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fieds: mandatoryFields});

            const getData = await adminModel.findOne({Email: req.body.email});
            if(getData?._id) return res.status(200).json({status: 400, message: 'This Email is already used'});

            req.body.password = bcrypt.hashSync(req.body.password, 10);
            let body = {};
            for(let key in req.body){
                body[collectionFields[key]] = req.body[key];
            }

            const result = await new adminModel(body).save();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record Created', data: result});
            else
                return res.status(200).json({status: 400, message: 'Record not created'});

        }catch(error){
            return HandleError(error);
        }
    },

    login: async (req, res) => {
        try {
            if (!req.body && Object.keys(req.body).length == 0)
            return res
                .status(200)
                .json({ status: 400, message: "Request Body should not be empty" });

            let mandatoryFields = [];

            if (!req.body.email) mandatoryFields.push("email");
            if (!req.body.password) mandatoryFields.push("password");

            if (mandatoryFields.length > 0)
            return res.status(200).json({
                status: 400,
                message: "Mandatory Fields Error",
                fields: mandatoryFields,
            });

            const result = await adminModel.findOne({ Email: req.body.email, IsActive: true, IsDeleted: false });
            if (result != null) {
                let valid = bcrypt.compareSync(req.body.password, result?.Password);
                if (valid){
                    const responseObj = {_id : result?._id, name: result?.Name, email: result?.Email, profile: 'admin'};
                    let jwtToken = await token.generateToken(responseObj);
                    req.session.userotken = jwtToken?.token;
                    req.session.userid = result?._id;
                    req.session.profile = 'admin';
                    req.session.username = result?.Name;
                    return res
                    .status(200)
                    .json({
                        status: 200,
                        message: "Login Successful",
                        user: responseObj,
                        token: jwtToken?.token
                    });
                }
            }
            return res.status(200).json({
            status: 401,
            message: "Wrong Credentials",
            });
        } catch (error) {
            return HandleError(error);
        }
    },

    update: async(req, res) => {
        try{
            let filterObj = {};
            let updateObj = {};

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(!req.body || Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Update field is missing'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]
            
            for(let key in req.body)
                updateObj[collectionFields[key]] = req.body[key]
            
            const result = await adminModel.findOneAndUpdate(filterObj,updateObj,{new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record updated'});
            else
                return res.status(200).json({status: 400, message: 'Record updation failed'});
        }catch(error){
            return HandleError(error);
        }
    },

    delete: async(req, res) => {
        try{
            let filterObj = {};

            if(!req.params || Object.keys(req.params).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]

            const result = await adminModel.findOneAndUpdate(filterObj, {IsDeleted: true, IsActive: false}, {new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record deleted'});
            else
                return res.status(200).json({status: 400, message: 'Record deletion failed'});
        }catch(error){
            return HandleError(error);
        }
    }

}

module.exports = adminController;