var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports.UserModel = mongoose.model('UserModel', new Schema ({
    id:         ObjectId,
    firstName:  { type: String, required: '{PATH} is required.' },
    lastName:   { type: String, required: '{PATH} is required.' },
    email:      { type: String, required: '{PATH} is required.', unique: true },
    password:   { type: String, required: '{PATH} is required.' }
}));