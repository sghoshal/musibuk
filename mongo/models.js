var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// The actual collection name will be all lower case with an 's' appended

//  collection - 'usermodels'
module.exports.User = mongoose.model('user', new Schema ({
    id:         ObjectId,
    firstName:  { type: String, required: '{PATH} is required.' },
    lastName:   { type: String, required: '{PATH} is required.' },
    email:      { type: String, required: '{PATH} is required.', unique: true },
    password:   { type: String, required: '{PATH} is required.' }
}));

// collection - 'exercises'
module.exports.Exercise = mongoose.model('exercise', new Schema({
    id:         ObjectId,
    name:       { type: String, required: '{PATH} is required.', unique: true },
    bpm:        { type: Number, default: 80 } 
}));