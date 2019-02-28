const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('../models/Todo');
// const User = require('../models/User');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	});

	todo.save().then(
		doc => {
			res.send(doc);
		},
		err => {
			res.status(400).send(err);
		}
	);
});

app.listen(3000, () => {
	console.info('Started on port 3000');
});

app.get('/todos', (req, res) => {
	Todo.find().then(
		todos => {
			// Places array in wrapper object label todos
			res.send({ todos });
		},
		err => {
			res.status(400).send(err);
		}
	);
});

module.exports = app;
