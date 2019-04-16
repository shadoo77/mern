const validator = require('validator');
const isEmpty = require('./is-empty');

const validateExperience = (data) => {
	let { title, company, from } = data;
	let errors = {};

	title = !isEmpty(title) ? title : '';
	company = !isEmpty(company) ? company : '';
	from = !isEmpty(from) ? from : '';

	if (validator.isEmpty(title)) {
		errors.title = 'Job title field is required!';
	}

	if (validator.isEmpty(company)) {
		errors.company = 'Company field is required!';
	}

	if (validator.isEmpty(from)) {
		errors.from = 'From date field is required!';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateExperience;
