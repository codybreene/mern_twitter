const Validator = require('validator');
const validText = require('./valid-text');

const validTweetInput = (data) => {
    let errors = {};

    data.text = validText(data.text) ? data.text : "";

    if(!Validator.isLength(data.text, { min: 2, max: 160})) {
        errors.text = "Tweet must be between 2 and 160 characters"
    }

    if(Validator.isEmpty(data.text)) {
        errors.text = "You need content in the tweet before tweeting..."
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = validTweetInput;