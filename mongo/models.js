var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// The actual collection name will be all lower case with an 's' appended

//  collection - 'usermodels'
module.exports.User = mongoose.model('user', new Schema({
    id:         ObjectId,
    firstName:  { type: String, required: '{PATH} is required.' },
    lastName:   { type: String, required: '{PATH} is required.' },
    email:      { type: String, required: '{PATH} is required.', unique: true },
    password:   { type: String, required: '{PATH} is required.' }
}));

// collection - 'exercises'
var exerciseSchema = new Schema({
    id:         ObjectId,
    user_id:    { type: String, required: '{PATH} is required.' },
    name:       { type: String, required: '{PATH} is required.' },
    bpm:        { type: Number, default: 80 },
    folder:     { type: String, default: "root" }
});

// The combination of exercise name and the folder name should be unique.
exerciseSchema.index({ name: 1, folder: 1 }, { unique: true } );

module.exports.Exercise = mongoose.model('exercise', exerciseSchema );