const mongoose = require('mongoose');
const Todo = require('../model/Todo');
const User = require('../model/User');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

const newTodo = new Todo({
	text: 'Learn Angular',
	completed: false,
	completedAt: 0
});

newTodo.save().then(
	doc => {
		console.info('Saved todo', doc);
	},
	err => {
		console.warn('Unable to save todo.', err);
	}
);

const newUser = new User({
	email: 'tim@example.com'
});

newUser.save().then(
	doc => {
		console.info('Saved user', doc);
	},
	err => {
		console.warn('Unable to save user.', err);
	}
);
