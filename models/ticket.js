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
    Attachments: {
        type: Array,
        required: false,
        default: []
    },
    Project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'project'
    },
    AssignTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'employee',
        default: null
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
                type: Object,
                required: false,
                default: null
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
    Comments: [
        new Schema({
            Name: {
                type: String,
                required: false,
                default: null
            },
            By: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                default: null
            },
            Comment: {
                type: String,
                required: false,
                default: null
            },
        }, {timestamps: true})
    ],
    EstimateDateTime: {
        type: Date,
        required: false,
        default: null
    },
    ActualDateTime: {
        type: String,
        required: false,
        default: null
    },
    ClosedDateTime: {
        type: Date,
        required: false,
        default: null
    },
    ReopenDateTime: {
        type: Date,
        required: false,
        default : null
    },
    Status: {
        type: String,
        required: true,
        enum: ['New', 'Open', 'Ready To Dev', 'Assign To Dev', 'Dev Start', 'Dev Done', 'In QA', 'QA Done', 'Solved', 'Closed', 'Reopen'],
        default: 'Open'
    },
    CreatedBy: {
        type: Object,
        required: false,
        default: null
    },
    LastModifiedBy: {
        type: Object,
        required: false,
        default: null
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