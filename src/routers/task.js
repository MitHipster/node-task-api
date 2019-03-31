const express = require('express');
const router = express.Router();

const Task = require('../../models/Task');

router.post('/tasks', async (req, res) => {
	try {
		const task = await Task.create(req.body);
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch('/tasks/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	// Check to see if key is a valid property of the Task model
	const isValidOperation = updates.every(update => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Attempted to update an invalid field' });
	}

	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		if (!task) {
			return res.status(404).send();
		}

		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
