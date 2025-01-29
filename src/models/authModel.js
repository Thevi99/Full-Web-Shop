const { model, models, Schema } = require('mongoose');

const schema = new Schema({
    Client_ID: {
        type: String,
        required: true
    },
    Licenses: {
        type: Array,
        default: [],
        required: true
    },
    Assets: {
        type: Array,
        default: [],
        required: true
    },
    Identifier: {
        type: String,
        default: null,
        required: false
    },
    Last_Identifier: {
        type: String,
        default: null,
        required: false
    },
    Cooldown: {
        type: Number,
        default: 0,
        required: false
    },
    Blacklisted: {
        type: Boolean,
        default: false,
        required: false
    }
});

// ใช้โมเดลที่มีอยู่ หรือสร้างใหม่หากไม่มี
module.exports = models.Auth || model('Auth', schema, 'Auth');
