const express = require('express');

require('./db/mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
	User.create(req.body).then(
		doc => {
			res.status(201).send(doc);
		},
		err => {
			res.status(400).send(err);
		}
	);
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
	Task.create(req.body).then(
		doc => {
			res.status(201).send(doc);
		},
		err => {
			res.status(400).send(err);
		}
	);
});

app.get('/tasks/:id', (req, res) => {
	Task.findById(req.params.id)
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
