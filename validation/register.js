const validator = require('validator');
const isEmpty = require('./is-empty');

const validateRegisterInput = (data) => {
	let { name, email, password, password2 } = data;
	let errors = {};

	name = !isEmpty(name) ? name : '';
	email = !isEmpty(email) ? email : '';
	password = !isEmpty(password) ? password : '';
	password2 = !isEmpty(password2) ? password2 : '';

	if (!validator.isLength(name, { min: 3, max: 30 })) {
		errors.name = 'Name must be between 3 and 30 characters';
	}

	if (validator.isEmpty(name)) {
		errors.name = 'Name field is required!';
	}

	if (validator.isEmpty(email)) {
		errors.email = 'Email field is required!';
	}

	if (!validator.isEmail(email)) {
		errors.email = 'Email is invalid!';
	}

	if (validator.isEmpty(password)) {
		errors.password = 'Password field is required!';
	}

	if (!validator.isLength(password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters!';
	}

	if (validator.isEmpty(password2)) {
		errors.password2 = 'Confirm Password field is required!';
	}

	if (!validator.equals(password, password2)) {
		errors.password2 = 'Passwords must match!';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateRegisterInput;
