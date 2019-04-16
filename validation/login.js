const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginInput = (data) => {
	let { email, password } = data;
	let errors = {};

	email = !isEmpty(email) ? email : '';
	password = !isEmpty(password) ? password : '';

	if (validator.isEmpty(email)) {
		errors.email = 'Email field is required!';
	} else if (!validator.isEmail(email)) {
		errors.email = 'Email is invalid!';
	}

	if (validator.isEmpty(password)) {
		errors.password = 'Password field is required!';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateLoginInput;
