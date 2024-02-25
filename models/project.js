
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'customer'
    },
    Manager: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'admin'
    },
    TeamMember: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'employee'
    }],
    Status: {
        type: String,
        required: false,
        default: 'New',
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'admin',
    },
    LastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'admin',
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


module.exports = mongoose.model('project', schema);