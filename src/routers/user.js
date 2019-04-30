const express = require('express');
const router = new express.Router();
const sharp = require('sharp');

const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const { welcomeEmail, cancellationEmail } = require('../middleware/email');
const User = require('../models/User');

router.post('/users', async (req, res) => {
	try {
		const user = await User.create(req.body);
		// Send a welcome email using SendGrid
		welcomeEmail(user.email, user.name);
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

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password'];
	// Check to see if key is a valid property of the User model
	const isValidOperation = updates.every(update => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Attempted to update an invalid field' });
	}

	try {
		updates.forEach(update => (req.user[update] = req.body[update]));
		await req.user.save();

		res.status(200).send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		// Removes user using built in mongoose method
		await req.user.remove();
		// Send a goodbye email using SendGrid
		cancellationEmail(req.user.email, req.user.name);

		res.status(200).send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		// Use sharp utility to resize image and convert to png if necessary
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();

		// Store a buffer of the file in db instead of using dest option in multer to save file
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	// eslint-disable-next-line no-unused-vars
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.patch('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();
		res.status(200).send();
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			return res.status(404).send({ error: 'Avatar image not found' });
		}

		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send(error);
	}
});

module.exports = router;
