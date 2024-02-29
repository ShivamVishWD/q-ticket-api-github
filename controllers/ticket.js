const { HandleError } = require('../helper/ErrorHandler');
const ticketModel = require('../models/ticket');
const projectModel = require('../models/project');
const adminModel = require('../models/admin')
const employeeModel = require('../models/employee')
const customerModel = require('../models/customer')
const { sendEmail } = require('../helper/Mail');
const { ticketCreationMailTemplate, ticketUpdateMailTemplate } = require('../templates/mail/sendMailTemplates');
const moment = require('moment-timezone');

const collectionFields = {
    id: "_id",
    ticket: "TicketNumber",
    subject: 'Subject',
    description: 'Description',
    attachments: 'Attachments',
    project: 'Project',
    assign: 'AssignTo',
    type: "TicketType",
    priority: "TicketPriority",
    logs: "Logs",
    estimate: 'EstimateDateTime',
    actual: 'ActualDateTime',
    status: 'Status',
    logby: "LogBy",
    logtime: "LogTime",
    activity: "Activity",
    comment: "Comment",
    closeTime: "ClosedDateTime",
    reopenTime: "ReopenDateTime",
    by: "By",
    name: "Name",
    createby: 'CreatedBy',
    updateby: 'LastModifiedBy'
}

const ticketController = {

    get: async(req, res) => {
        try{
            let filterObj = {}
            if(req.query && Object.keys(req.query).length > 0){
                for(let key in req.query)
                    filterObj[collectionFields[key]]= req.query[key]
            }

            if('count' in req.query){
                const count = await ticketModel.find({ IsActive: true, IsDeleted: false }).countDocuments();
                return res.status(200).json({status: 200, message: 'Total Customer', count})
            }

            filterObj = { ...filterObj, IsActive: true, IsDeleted: false }
            
            const result = await ticketModel.find(filterObj).populate('Project').populate('AssignTo').populate("Logs.LogBy");
            const baseUrl = req.protocol + '://' + req.headers.host + '/';
            return res.status(200).json({status: 200, message: 'Records Fetched', baseUrl, data: result});
        }catch(error){
            console.log('error : ',error)
            return HandleError(error)
        }
    },

    insert: async(req, res) => {
        try{
            if(req.authData && req?.authData?.profile == 'employee')
                return res.status(200).json({status:400, message: 'Permissio Denied'})

            if(!req.body && Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Request Body should not be empty'});

            let mandatoryFields = [];
            if(!req.body.subject) mandatoryFields.push('subject');
            if(!req.body.description) mandatoryFields.push('description');
            if(!req.body.project) mandatoryFields.push('project');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fieds: mandatoryFields})

            const getProject = await projectModel.findOne({_id: req.body.project, IsActive: true, IsDeleted: false}).populate('Manager').populate('Customer');
            if(getProject == null) return res.status(200).json({status: 400, message: 'Ticket not created because of Inactive project'});

            const getCountOfTickets = await ticketModel.find({Project: req.body.project}).countDocuments();

            let body = {};
            for(let key in req.body){
                body[collectionFields[key]] = req.body[key];
            }

            let attachments = [];
            if(req.files && req.files.length > 0){
                for(let item of req.files){
                    const filePath = 'uploads/'+item?.filename;
                    attachments.push(filePath);
                }
            }

            let createUpdateByObj = {};

            let getUserDetail = await adminModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await customerModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await employeeModel.findOne({_id: req?.authData?._id})

            createUpdateByObj = {
                Id: getUserDetail?._id,
                Name: getUserDetail?.Name,
                Email: getUserDetail?.Email
            }
            console.log(createUpdateByObj)
            body[collectionFields['attachments']] = attachments;
            body[collectionFields['ticket']] = String(getProject?.Alias != null ? getProject?.Alias : getProject?.Name).toUpperCase() + "-" + String((getCountOfTickets+1)).padStart(4, '0');
            body[collectionFields['createby']] = createUpdateByObj;
            body[collectionFields['updateby']] = createUpdateByObj;

            const result = await new ticketModel(body).save();
            if(result?._id){
                if(getProject?.Manager != null)
                    sendEmail(getProject?.Manager?.Email, 'New Ticket Created for '+getProject?.Name, '', ticketCreationMailTemplate(getProject?.Manager?.Name, getProject?.Name, result?.TicketNumber, moment(result?.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')))
                if(getProject?.Customer != null)
                    sendEmail(getProject?.Customer?.Email, 'New Ticket Created for '+getProject?.Name, '', ticketCreationMailTemplate(getProject?.Customer?.Name, getProject?.Name, result?.TicketNumber, moment(result?.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')))
                return res.status(200).json({status: 200, message: 'Record created', data: result})
            }else
                return res.status(200).json({status: 400, message: 'Record creation failed'})
        }catch(error){
            return HandleError(error)
        }
    },

    update: async(req, res) => {
        try{
            let filterObj = {};
            let updateObj = {};

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(req.files && req.files.length == 0)
                return res.status(200).json({status: 400, message: 'Missing file attachment'});
            
            if((!req.body || Object.keys(req.body).length == 0) && !req.files)
                return res.status(200).json({status: 400, message: 'Update field is missing'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]
            
            for(let key in req.body)
                updateObj[collectionFields[key]] = req.body[key]

            const ticketDetail = await ticketModel.findOne({$or: [{_id: req?.query?.id}, {TicketNumber: req?.query?.ticket}]}).populate('Project').populate('AssignTo');
            const getProject = await projectModel.findOne({_id: ticketDetail?.Project?._id, IsActive: true, IsDeleted: false}).populate('Manager').populate('Customer');
            
            let updatedBy = {};

            let getUserDetail = await adminModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await customerModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await employeeModel.findOne({_id: req?.authData?._id})

            updatedBy = {
                Id: getUserDetail?._id,
                Name: getUserDetail?.Name,
                Email: getUserDetail?.Email
            }
            
            let attachments = [];
            if(req.files && req.files.length > 0){
                for(let item of req.files){
                    const filePath = 'uploads/'+item?.filename;
                    attachments.push(filePath)
                }
                updateObj[collectionFields['attachments']] = attachments;
            }

            if(req?.body?.status == 'Closed'){
                updateObj[collectionFields['closeTime']] = new Date()
                let totalDaysArr = Array(ticketDetail?.Logs).map(item => { return item?.LogTime }) || [];
                updateObj[collectionFields['actual']] = calculateTotalDays(totalDaysArr);
            }

            if(req?.body?.status == 'Reopen')
                updateObj[collectionFields['reopenTime']] = new Date()

            updateObj[collectionFields['updateby']] = updatedBy;
            const result = await ticketModel.findOneAndUpdate(filterObj,updateObj,{new: true}).exec();
            if(result?._id){
                if(req.body.status && req.body.status != 'Solved'){
                    if(getProject?.Customer != null)
                        sendEmail(getProject?.Customer?.Email , `Ticket Status Update: ${result?.TicketNumber} - ${result?.Status}` , '', ticketUpdateMailTemplate('status', ticketDetail?.AssignTo?.Name, getProject?.Customer?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                    if(getProject?.Manager != null)
                        sendEmail(getProject?.Manager?.Email , `Ticket Status Update: ${result?.TicketNumber} - ${result?.Status}` , '', ticketUpdateMailTemplate('status', ticketDetail?.AssignTo?.Name, getProject?.Manager?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                }
                if(req.body.assign){
                    const getAssignee = await ticketModel.findOne({_id: result?._id}).populate('AssignTo');
                    if(getProject?.Customer != null)
                        sendEmail(getProject?.Customer?.Email , `Ticket Update: Assigned to: ${getAssignee?.AssignTo?.Name}`, '', ticketUpdateMailTemplate('assign', getAssignee?.AssignTo?.Name, getProject?.Customer?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                    if(getProject?.Manager != null)
                        sendEmail(getProject?.Manager?.Email , `Ticket Update: Assigned to: ${getAssignee?.AssignTo?.Name}`, '', ticketUpdateMailTemplate('assign', getAssignee?.AssignTo?.Name, getProject?.Manager?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                    if(getAssignee?.AssignTo != null)
                        sendEmail(getAssignee?.AssignTo?.Email , `Ticket Update: Assigned to: ${getAssignee?.AssignTo?.Name}`, '', ticketUpdateMailTemplate('assign', getAssignee?.AssignTo?.Name, getProject?.Manager?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                }
                if(req.body.estimate){
                    if(getProject?.Customer != null)
                        sendEmail(getProject?.Customer?.Email , `Ticket Update: ETA for: ${result?.TicketNumber}` , '', ticketUpdateMailTemplate('eta', ticketDetail?.AssignTo?.Name, getProject?.Customer?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                    if(getProject?.Manager != null)
                        sendEmail(getProject?.Manager?.Email , `Ticket Update: ETA for: ${result?.TicketNumber}` , '', ticketUpdateMailTemplate('eta', ticketDetail?.AssignTo?.Name, getProject?.Manager?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                }
                if(req.body.status && req.body.status == 'Solved'){
                    if(getProject?.Customer != null)
                        sendEmail(getProject?.Customer?.Email , `Ticket Closure: Action Required` , '', ticketUpdateMailTemplate('status', ticketDetail?.AssignTo?.Name, getProject?.Customer?.Name, result?.TicketNumber, moment(result?.EstimateDateTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), result?.Status))
                }
                return res.status(200).json({status: 200, message: 'Record updated'});
            }else
                return res.status(200).json({status: 400, message: 'Record updation failed'});
        }catch(error){
            return HandleError(error)
        }
    },

    delete: async(req, res) => {
        try{
            if(req.authData && req?.authData?.profile == 'employee')
                return res.status(200).json({status:400, message: 'Permissio Denied'})
            
            let filterObj = {};

            if(!req.params || Object.keys(req.params).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]

            const result = await ticketModel.findOneAndUpdate(filterObj, {IsDeleted: true, IsActive: false}, {new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Record deleted'});
            else
                return res.status(200).json({status: 400, message: 'Record deletion failed'});
        }catch(error){
            return HandleError(error)
        }
    },

    updateLog: async(req, res) => {
        try{
            let filterObj = {};
            let updateObj = {};

            if(req?.authData && req?.authData?.profile == 'customer')
                return res.status(200).json({status: 400, message: 'Permission Denied'});

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(!req.body || Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Update field is missing from request body'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]
            
            for(let key in req.body)
                updateObj[collectionFields[key]] = req.body[key]

            const getTicketDetail = await ticketModel.findOne(filterObj);

            let totalDaysArr = getTicketDetail?.Logs.map(item => { return item?.LogTime }) || [];
            console.log(totalDaysArr, 'totl day arr')
            let newLog = String(req?.body?.logtime).split(' ');
            totalDaysArr = [ ...totalDaysArr, ...newLog ];
            let actualDateTime = calculateTotalDays(totalDaysArr) || null;
            await ticketModel.findOneAndUpdate(filterObj, {ActualDateTime: actualDateTime})

            let logBy = {};

            let getUserDetail = await adminModel.findOne({_id: req?.body?.logby})
            if(getUserDetail == null)
                getUserDetail = await customerModel.findOne({_id: req?.body?.logby})
            if(getUserDetail == null)
                getUserDetail = await employeeModel.findOne({_id: req?.body?.logby})

            logBy = {
                Id: getUserDetail?._id,
                Name: getUserDetail?.Name,
                Email: getUserDetail?.Email
            }
            updateObj[collectionFields['logby']] = logBy;
            
            const result = await ticketModel.findOneAndUpdate(filterObj,{$push: {Logs: updateObj}},{new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Log updated'});
            else
                return res.status(200).json({status: 400, message: 'Log updation failed'});
        }catch(error){
            return HandleError(error)
        }
    },

    updateComment: async(req, res) => {
        try{
            let filterObj = {};
            let updateObj = {};

            if(!req.query || Object.keys(req.query).length == 0)
                return res.status(200).json({status: 400, message: 'Filter crieteria missing'});

            if(!req.body || Object.keys(req.body).length == 0)
                return res.status(200).json({status: 400, message: 'Update field is missing from request body'});

            for(let key in req.query)
                filterObj[collectionFields[key]] = req.query[key]

            let getUserDetail = await adminModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await customerModel.findOne({_id: req?.authData?._id})
            if(getUserDetail == null)
                getUserDetail = await employeeModel.findOne({_id: req?.authData?._id})

            for(let key in req.body)
                updateObj[collectionFields[key]] = req.body[key]
            
            const result = await ticketModel.findOneAndUpdate(filterObj,{$push: {Comments: updateObj}},{new: true}).exec();
            if(result?._id)
                return res.status(200).json({status: 200, message: 'Comment updated'});
            else
                return res.status(200).json({status: 400, message: 'Comment updation failed'});
        }catch(error){
            return HandleError(error)
        }
    }

}

function calculateTotalDays(timeStrings) {
    let totalMinutes = 0;

    // Define conversion factors
    const conversionFactors = {
        'w': 7 * 24 * 60, // 1 week = 7 days * 24 hours * 60 minutes
        'd': 24 * 60,      // 1 day = 24 hours * 60 minutes
        'h': 60,           // 1 hour = 60 minutes
        'm': 1             // 1 minute
    };

    // Loop through each time string and sum up the total minutes
    timeStrings.forEach(timeString => {
        const value = parseInt(timeString);
        const unit = timeString.charAt(timeString.length - 1);

        if (!isNaN(value) && unit in conversionFactors) {
            totalMinutes += value * conversionFactors[unit];
        }
    });

    // Convert total minutes back to weeks, days, hours, and minutes
    const weeks = Math.floor(totalMinutes / (7 * 24 * 60));
    const days = Math.floor((totalMinutes % (7 * 24 * 60)) / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    // Construct the result string
    const result = [];
    if (weeks > 0) result.push(`${weeks}w`);
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);

    return result.join(' ');
}

module.exports = ticketController;