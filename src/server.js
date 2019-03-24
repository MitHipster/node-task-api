const express = require('express');

require('./db/mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
	User.create(req.body)
		.then(user => {
			res.status(201).send(user);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

app.get('/users', (req, res) => {
	User.find()
		.then(users => {
			res.status(200).send(users);
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

app.get('/users/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (!user) {
				return res.status(404).send();
			}
			res.status(200).send(user);
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

app.post('/tasks', (req, res) => {
	Task.create(req.body)
		.then(user => {
			res.status(201).send(user);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

app.get('/tasks', (req, res) => {
	Task.find()
		.then(tasks => {
			res.status(200).send(tasks);
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

app.get('/tasks/:id', (req, res) => {
	Task.findById(req.params.id)
		.then(task => {
			if (!task) {
				return res.status(404).send();
			}
			res.status(200).send(task);
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

app.listen(port, () => {
	console.info(`Started on port ${port}`);
});

module.exports = app;
