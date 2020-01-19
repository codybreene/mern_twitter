const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    handle: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// first arg is a string, what we want our model to be called
// second arg, schema we want to pass in (UsersSchema that we defined above)
const User = mongoose.model('users', UserSchema);

module.exports = User;