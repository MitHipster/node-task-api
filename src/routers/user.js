const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/users', async (req, res) => {
	try {
		const user = await User.create(req.body);
		// Generate a token on the user instance
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		// Call a custom method to find a matching user by email and password
		const user = await User.findByCredentials(req.body.email, req.body.password);
		// Generate a token on the user instance
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		// Update user tokens by filtering out the active token
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token !== req.token;
		});
		// Update user object with filtered token array
		await req.user.save();

		res.status(200).send();
	} catch (error) {
		res.status(500).send();
	}
});

// Route to remove all login tokens, closing out all sessions
router.post('/users/logout/all', auth, async (req, res) => {
	try {
		// Zero out users token array
		req.user.tokens = [];
		// Update user object with empty token array
		await req.user.save();

		res.status(200).send();
	} catch (error) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.status(200).send(req.user);
});

router.get('/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch('/users/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password'];
	// Check to see if key is a valid property of the User model
	const isValidOperation = updates.every(update => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Attempted to update an invalid field' });
	}

	try {
		const user = await User.findById(req.params.id);

		updates.forEach(update => (user[update] = req.body[update]));
		await user.save();

		if (!user) {
			return res.status(404).send();
		}

		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
