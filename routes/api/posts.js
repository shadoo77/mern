const express = require('express');
const cors = require('cors');
const passport = require('passport');
const router = express.Router();

// Load Post model
const Post = require('../../models/Post');
// Load Profile model
const Profile = require('../../models/Profile');

// Load validation file
const validatePostInput = require('../../validation/post');

// @route  GET api/users/posts
// @desc   Tests posts route
// @access Public
router.get('/test', (req, res) => res.status(200).json({ msg: 'Posts works!' }));

// @route  GET api/posts
// @desc   Get posts
// @access Public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then((posts) => res.json(posts))
		.catch((err) => res.status(404).json({ error: 'No post found!' }));
});

// @route  GET api/posts/:id
// @desc   Get one (single) post by ID
// @access Public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => res.json(post))
		.catch((err) => res.status(404).json({ error: "No post found on this post's id" }));
});

// @route  POST api/posts
// @desc   Add a post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation process
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const { text, name, avatar } = req.body;
	const newPost = new Post({
		text,
		name,
		avatar,
		user: req.user.id
	});
	newPost.save().then((post) => res.json(post)).catch((err) => res.status(404).json(err));
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ error: 'User is not authorized!' });
					}
					post.remove().then(() => res.json({ success: true })).catch((err) => res.status(404).json(err));
				})
				.catch((err) => res.status(404).json({ error: 'No post found with that ID' }));
		})
		.catch();
});

// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
						return res.status(400).json({ error: 'User is already liked this post!' });
					}
					// Add like
					post.likes.unshift({ user: req.user.id });
					post.save().then((post) => res.json(post));
				})
				.catch((err) => res.status(404).json({ alreadyLiked: 'No post found with that ID' }));
		})
		.catch();
});

// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
						return res.status(400).json({ notLiked: "You haven't yet liked this post!" });
					}
					// Delete like
					const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(req.user.id);

					post.likes.splice(removeIndex, 1);
					post.save().then((post) => res.json(post));
				})
				.catch((err) => res.status(404).json({ error: 'No post found with that ID' }));
		})
		.catch();
});

// @route  POST api/posts/comment/:id
// @desc   Add comment to a post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation process
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	Post.findById(req.params.id)
		.then((post) => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			};
			post.comments.unshift(newComment);
			post.save().then((post) => res.json(post));
		})
		.catch((err) => res.status(404).json({ error: 'No post found with that ID' }));
});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
				res.status(404).json({ error: 'The comment is not found!' });
			}
			const removeIndex = post.comments.map((item) => item._id.toString()).indexOf(req.params.comment_id);
			post.comments.splice(removeIndex, 1);
			post.save().then((post) => res.json(post));
		})
		.catch((err) => res.status(404).json({ error: 'No post found with that ID' }));
});

module.exports = router;
