const validator = require('validator');
const isEmpty = require('./is-empty');

const validateProfileInput = (data) => {
	let { handle, status, skills, website, youtube, twitter, facebook, linkedin, instagram } = data;
	let errors = {};

	handle = !isEmpty(handle) ? handle : '';
	status = !isEmpty(status) ? status : '';
	skills = !isEmpty(skills) ? skills : '';

	if (!validator.isLength(handle, { min: 3, max: 40 })) {
		errors.handle = 'Handle needs to be between 3 and 40 characters!';
	}

	if (validator.isEmpty(handle)) {
		errors.handle = "Profile's handle is required!";
	}

	if (validator.isEmpty(status)) {
		errors.status = "Profile's status is required!";
	}

	if (validator.isEmpty(skills)) {
		errors.skills = 'Skills is required!';
	}

	if (!isEmpty(website)) {
		if (!validator.isURL(website)) {
			errors.website = 'Invalid Url!';
		}
	}

	if (!isEmpty(youtube)) {
		if (!validator.isURL(youtube)) {
			errors.youtube = 'Invalid Url!';
		}
	}

	if (!isEmpty(twitter)) {
		if (!validator.isURL(twitter)) {
			errors.twitter = 'Invalid Url!';
		}
	}

	if (!isEmpty(facebook)) {
		if (!validator.isURL(facebook)) {
			errors.facebook = 'Invalid Url!';
		}
	}

	if (!isEmpty(linkedin)) {
		if (!validator.isURL(linkedin)) {
			errors.linkedin = 'Invalid Url!';
		}
	}

	if (!isEmpty(instagram)) {
		if (!validator.isURL(instagram)) {
			errors.instagram = 'Invalid Url!';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateProfileInput;
