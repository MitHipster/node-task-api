const express = require('express');
const { ObjectId } = require('mongodb');

require('./db/mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	user.save().then(
		doc => {
			res.send(doc);
		},
		err => {
			res.status(400).send(err);
		}
	);
});

app.post('/tasks', (req, res) => {
	const task = new Task({
		description: req.body.description
	});

	task.save().then(
		doc => {
			res.send(doc);
		},
		err => {
			res.status(400).send(err);
		}
	);
});

app.get('/tasks/:id', (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) return res.status(404).send();

	Task.findById(id)
		.then(task => {
			if (task) {
				res.status(200).send({ task });
			} else {
				res.status(404).send();
			}
		})
		.catch(() => {
			res.status(400).send();
		});
});

app.get('/tasks', (req, res) => {
	Task.find().then(
		tasks => {
			// Places array in wrapper object label tasks
			res.send({ tasks });
		},
		err => {
			res.status(400).send(err);
		}
	);
});

app.listen(port, () => {
	console.info(`Started on port ${port}`);
});

module.exports = app;
