const express = require('express');
const cors = require('cors');
const router = express.Router();
const passport = require('passport');

// Load Profile model
const Profile = require('../../models/Profile');
// Load User model
const User = require('../../models/User');

// Load validation file
const validateProfileInput = require('../../validation/profile');
const validateExperience = require('../../validation/experience');
const validateEducation = require('../../validation/education');

// @route  GET api/profile
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => res.status(200).json({ msg: 'Profile works!' }));

// @route  GET api/profile
// @desc   Get current user's profile route
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.user.id })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user!';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

// @route  GET api/profile/all
// @desc   Get All profiles
// @access Public
router.get('/all', (req, res) => {
	const errors = {};
	Profile.find()
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There are no profiles';
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json({ msg: 'There are no profiles' }));
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user';
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user';
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json({ msg: 'There is no profile for this user' }));
});

// @route  POST api/profile
// @desc   Create or update user's profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation process
	const { errors, isValid } = validateProfileInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Get fields
	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle) profileFields.handle = req.body.handle;
	if (req.body.company) profileFields.company = req.body.company;
	if (req.body.website) profileFields.website = req.body.website;
	if (req.body.location) profileFields.location = req.body.location;
	if (req.body.bio) profileFields.bio = req.body.bio;
	if (req.body.status) profileFields.status = req.body.status;
	if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
	// Skills handle
	if (typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}
	// Social
	profileFields.social = {};
	if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
	if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
	if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
	if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
	if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			if (profile) {
				// Update
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then((profile) => res.json(profile));
			} else {
				// Create

				// Check handle if exist
				Profile.findOne({ handle: profileFields.handle }).then((profile) => {
					if (profile) {
						errors.handle = 'That handle is already existed!';
						return res.status(404).json(errors);
					}
				});

				// Save profile
				new Profile(profileFields).save().then((profile) => res.json(profile)).catch((err) => console.log(err));
			}
		})
		.catch((err) => res.status(404).json(err));
});

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation process
	const { errors, isValid } = validateExperience(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const { title, company, location, from, to, current, description } = req.body;
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const newExp = {
				title,
				company,
				location,
				from,
				to,
				current,
				description
			};
			// Add to experience array
			profile.experience.unshift(newExp);
			profile.save().then((profile) => res.json(profile)).catch((err) => res.status(404).json(err));
		})
		.catch((err) => res.status(404).json(err));
});

// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation process
	const { errors, isValid } = validateEducation(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const { school, degree, fieldofstudy, from, to, current, description } = req.body;
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const newEdu = {
				school,
				degree,
				fieldofstudy,
				from,
				to,
				current,
				description
			};
			// Add to education array
			profile.education.unshift(newEdu);
			profile.save().then((profile) => res.json(profile)).catch((err) => res.status(404).json(err));
		})
		.catch((err) => res.status(404).json(err));
});

// @route  Delete api/profile/experience/:exp_id
// @desc   Delete experience to profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
			profile.experience.splice(removeIndex, 1);
			profile.save().then((profile) => res.json(profile)).catch((err) => res.status(404).json(err));
		})
		.catch((err) => res.status(404).json(err));
});

// @route  Delete api/profile/education/:edu_id
// @desc   Delete education to profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
			profile.education.splice(removeIndex, 1);
			profile.save().then((profile) => res.json(profile)).catch((err) => res.status(404).json(err));
		})
		.catch((err) => res.status(404).json(err));
});

// @route  Delete api/profile
// @desc   Delete user and profile
// @access Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndRemove({ user: req.user.id })
		.then(() => {
			User.findOneAndRemove({ _id: req.user.id })
				.then(() => res.json({ success: true }))
				.catch((err) => console.log(err));
		})
		.catch((err) => res.status(404).json(err));
});

module.exports = router;
