const { HandleError } = require('../helper/ErrorHandler');
const projectModel = require('../models/project');
const employeeModel = require('../models/employee');
const adminModel = require('../models/admin');

const collectionFields = {
    id: "_id",
    name: 'Name',
    alias: 'Alias',
    customer: 'Customer',
    manager: 'Manager',
    members: 'TeamMember',
    status: 'Status',
    active: 'IsActive',
    delete: 'IsDeleted',
    createby: 'CreatedBy',
    updateby: 'LastModifiedBy'
}

const projectController = {

    get: async(req, res) => {
        try{
            let filterObj = {}
            if(req.query && Object.keys(req.query).length > 0){
                for(let key in req.query)
                    filterObj[collectionFields[key]]= req.query[key]
            }

            if('count' in req.query){
                const count = await projectModel.find({ IsActive: true, IsDeleted: false }).countDocuments();
                return res.status(200).json({status: 200, message: 'Total Customer', count})
            }

            filterObj = { ...filterObj, IsActive: true, IsDeleted: false }

            const result = await projectModel.find(filterObj).populate('Customer').populate('Manager').populate('TeamMember').populate('CreatedBy').populate('LastModifiedBy');
            return res.status(200).json({status: 200, message: 'Records Fetched',  data: result});
        }catch(error){
            return HandleError(error);
        }
    },

    insert: async(req, res) => {
        try{
            if(req?.authData && req?.authData?.profile != 'admin')
                return res.status(200).json({status: 400, message: 'Permission Denied'});

            if(!req.body && Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Request Body should not be empty'});

            let mandatoryFields = [];
            if(!req.body.name) mandatoryFields.push('name');
            if(!req.body.alias) mandatoryFields.push('alias');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fieds: mandatoryFields})

            const getData = await projectModel.findOne({Name: req.body.name});
            if(getData?._id) return res.status(200).json({status: 400, message: 'This project already exist'});

            let body = {};
            for(let key in req.body){
                body[collectionFields[key]] = req.body[key];
            }

            body[collectionFields['createby']] = req?.authData?._id;
            body[collectionFields['updateby']] = req?.authData?._id;
            const result = await new projectModel(body).save();
            if(req.body.manager)
                await adminModel.findOneAndUpdate({_id: req.body.manager}, {$push: {Project: result?._id}}, {new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record created', data: result})
            else
                return res.status(200).json({status: 400, message: 'Record creation failed'})
        }catch(error){
            return HandleError(error);
        }
    },

    update: async(req, res) => {
        try{
            if(req?.authData && req?.authData?.profile != 'admin')
                return res.status(200).json({status: 400, message: 'Permission Denied'});

            let filterObj = {};
            let updateObj = {};

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(!req.body || Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Update field is missing from request body'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]

            for(let key in req.body)
                updateObj[collectionFields[key]] = req.body[key]
            
            updateObj[collectionFields['updateby']] = req?.authData?._id;
            const result = await projectModel.findOneAndUpdate(filterObj,{$set:updateObj},{new: true}).exec();
            if(req.body.manager){
                await employeeModel.findOneAndUpdate({_id: req.body.manager}, {$push: {Project: result?._id}}, {new: true}).exec();
            }
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
            if(req?.authData && req?.authData?.profile != 'admin')
                return res.status(200).json({status: 400, message: 'Permission Denied'});
            
            let filterObj = {};

            if(!req.params || Object.keys(req.params).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            for(let key in req.params)
                filterObj[collectionFields[key]] = req.params[key]

            const result = await projectModel.findOneAndUpdate(filterObj, {IsDeleted: true, IsActive: false, LastModifiedBy: req?.authData?._id}, {new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record deleted'});
            else
                return res.status(200).json({status: 400, message: 'Record deletion failed'});
        }catch(error){
            return HandleError(error);
        }
    },

    editTeam: async(req, res) => {
        try{
            if(req?.authData && req?.authData?.profile != 'admin')
                return res.status(200).json({status: 400, message: 'Permission Denied'});

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(!req.body || Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Update field is missing from request body'});

            if(!req.body.members || typeof req.body.members != 'object')
                return res.status(200).json({ status: 400, message: 'Members List is mandatory to update Team Members' });

            // Get Employees List which are already assign in the Project
            const employeeOfProject = await employeeModel.find({Project: req.query.id}).select("_id").exec();
            console.log('employeeOfProject : ',employeeOfProject)
            let employeesToBeRemoveFromProject = [];

            // Filter employees for remove project from them which are unselected
            if(employeeOfProject.length > 0){
                for(let item of employeeOfProject){3
                    if(!Array(req.body.members).includes(item._id))
                        employeesToBeRemoveFromProject.push(item._id)
                }
            }

            // Remove Project from Employee which are unselected
            if(employeesToBeRemoveFromProject.length > 0)
                await employeeModel.updateMany({_id: {$in: employeesToBeRemoveFromProject}}, {$pop: {Project: req.query.id}, LastModifiedBy: req?.authData?._id}, {new: true}).exec();

            // Update Team Members in the Project
            await projectModel.findOneAndUpdate({_id: req.query.id}, {$set: {TeamMember: req.body.members}, LastModifiedBy: req?.authData?._id}, {new: true}).exec();

            // Update Project array in employees which are selected
            await employeeModel.updateMany({_id: {$in: req.body.members}}, {$push: {Project: req.query.id}, LastModifiedBy: req?.authData?._id}, {new: true}).exec();

            return res.status(200).json({status: 200, message: 'Team Member Updated'});

        }catch(error){
            return HandleError(error)
        }
    }

}

module.exports = projectController;