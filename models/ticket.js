const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    TicketNumber: {
        type: String,
        required: true,
        unique: true
    },
    Subject: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false,
        default: null
    },
    Project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'project'
    },
    AssignTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'employee'
    },
    TicketType: {
        type: String,
        required: false,
        enum: ['Bug', 'Feature Request', 'Task', 'Story'],
        default: 'Bug'
    },
    TicketPriority: {
        type: String,
        required: false,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    Logs: [
        new Schema({
            LogBy: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: 'employee',
            },
            LogTime: {
                type: String,
                required: false,
                default: null
            },
            Activity: {
                type: String,
                required: false,
                default: null
            }
        }, {timestamps: true})
    ],
    Comments: [{
        type: String,
        required: false,
        default: null
    }],
    EstimateDateTime: {
        type: Date,
        required: false,
    },
    ActualDateTime: {
        type: Date,
        required: false
    },
    Status: {
        type: String,
        required: true,
        enum: ['New', 'Open', 'Ready To Dev', 'Assign To Dev', 'Dev Start', 'Dev Done', 'In QA', 'QA Done', 'Closed', 'Reopen'],
        default: 'New'
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        references: { type: [mongoose.Schema.Types.ObjectId], refPath: 'model_type' },
        model_type: {  type: String, enum: ['customer', 'admin'], required: false }
    },
    LastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        references: { type: [mongoose.Schema.Types.ObjectId], refPath: 'model_type' },
        model_type: {  type: String, enum: ['customer', 'admin', 'employee'], required: false }
    },
    IsActive: {
        type: Boolean,
        required: false,
        default: true
    },
    IsDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
},{
    timestamps: true
});


module.exports = mongoose.model('ticket', schema);