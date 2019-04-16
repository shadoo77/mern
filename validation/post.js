const validator = require('validator');
const isEmpty = require('./is-empty');

const validatePostInput = (data) => {
	let { text } = data;
	let errors = {};

	text = !isEmpty(text) ? text : '';

	if (validator.isEmpty(text)) {
		errors.text = 'Text field is required!';
	} else if (!validator.isLength(text, { min: 10, max: 500 })) {
		errors.text = 'Post must be between 10 and 500 characters!';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validatePostInput;
