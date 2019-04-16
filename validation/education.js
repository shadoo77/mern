const validator = require('validator');
const isEmpty = require('./is-empty');

const validateEducation = (data) => {
	let { school, degree, fieldofstudy, from } = data;
	let errors = {};

	school = !isEmpty(school) ? school : '';
	degree = !isEmpty(degree) ? degree : '';
	fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : '';
	from = !isEmpty(from) ? from : '';

	if (validator.isEmpty(school)) {
		errors.school = 'School field is required!';
	}

	if (validator.isEmpty(degree)) {
		errors.degree = 'Degree field is required!';
	}

	if (validator.isEmpty(fieldofstudy)) {
		errors.fieldofstudy = 'Field of study is required!';
	}

	if (validator.isEmpty(from)) {
		errors.from = 'From date field is required!';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateEducation;
