
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


module.exports = mongoose.model('admin', schema);