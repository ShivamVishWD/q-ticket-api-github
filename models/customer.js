
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Project: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'project'
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
    Permission: {
        type: Array,
        required: false,
        default: []
    },
    PermissionType: {
        type: String,
        required: false,
        default: null
    }
},{
    timestamps: true
});


module.exports = mongoose.model('customer', schema);