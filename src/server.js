const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const mongoose = require('./db/mongoose');
const Task = require('../models/Task');
// const User = require('../models/User');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/tasks', (req, res) => {
	const task = new Task({
		text: req.body.text
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
