const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        maxLength: 255
    },
    password: {
        type: String,
        required: false,
        maxLength: 2048
    },
    resetToken: {
        type: String,
        required: false,
        maxLength: 2048
    },
    expiry: {
        type: Date,
        required: false
    },
    admin: { //overides all permissions
        type: Boolean,
        default: false
    },
    permissions: {
        type: Object,
        default: {
            edit_accounts: false,
            edit_timelines: false,
            run_timelines: false,
            view_full_metrics: false,
            edit_bios: false,
            edit_perms: false,
        }
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Auth', authSchema);
