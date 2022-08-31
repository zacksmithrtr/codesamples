const mongoose = require("mongoose");
const managerSchema = new mongoose.Schema({
    position: ({type: String, maxLength: 1024}),
    userId: ({type: String, maxLength: 255})
});
const userSchema = new mongoose.Schema({
    email: ({
        type: String,
        required: true,
        maxLength: 255
    }),
    phone: ({
        type: String,
        required: true,
        maxLength: 255
    }),
    firstName: ({
        type: String,
        required: true,
        maxLength: 255
    }),
    lastName: ({
        type: String,
        required: true,
        maxLength: 255
    }),
    dateCreated: {
        type: Date,
        default: Date.now
    },
    accountType: {
        type: String,
        required: true,
        maxLength: 255
    },
    focus: {
        type: String,
        required: false,
        maxLength: 255
    },
    team: {
        type: String,
        required: false,
        maxLength: 255
    },
    managers: [ //managers = [{position: "Driver Manager", userId: "_id"}, {position: "Safety Manager", userId: "_id"}]
        managerSchema
    ],
    archived: {
        type: Boolean,
        required: true,
        default: false
    },
    archiveReason: {
        type: String,
        maxLength: 1024,
        required: false
    },
    archiveStatus: {
        type: String,
        maxLength: 1024,
        required: false
    },
    archivedDate: {
        type: Date,
        require: false
    },
    lastDayActive: {
        type: Date,
        require: false
    },
    organization: {
        type: String,
        maxLength: 255,
        required: true,
    }
});

userSchema.index({"firstName": "text", "lastName": "text", "email": "text"}, {weights: {firstName: 3, lastName: 3, email: 1}});


module.exports = mongoose.model("User", userSchema);
