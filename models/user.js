var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false}
});

// configure user to add passport local mongoose in order to access its methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);