const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.post('/tasks', auth, async (req, res) => {
	try {
		// const task = await Task.create(req.body);
		const task = new Task({
			...req.body,
			owner: req.user._id
		});

		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/tasks', auth, async (req, res) => {
	const match = {};

	if (req.query.completed) {
		// Need to convert provided string to a boolean
		match.completed = req.query.completed === 'true';
	}

	try {
		// Populate tasks object on user
		await req.user
			.populate({
				path: 'tasks',
				match
			})
			.execPopulate();

		// Send back tasks off user object
		res.status(200).send(req.user.tasks);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id
		});

		if (!task) {
			return res.status(404).send();
		}

		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	// Check to see if key is a valid property of the Task model
	const isValidOperation = updates.every(update => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Attempted to update an invalid field' });
	}

	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id
		});

		if (!task) {
			return res.status(404).send();
		}

		updates.forEach(update => (task[update] = req.body[update]));
		await task.save();

		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id
		});

		if (!task) {
			return res.status(404).send();
		}

		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
