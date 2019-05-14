const faker = require('faker');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const ids = {
	existingOne: new mongoose.Types.ObjectId(),
	existingTwo: new mongoose.Types.ObjectId()
};
const tokens = {
	existingOne: jwt.sign({ _id: ids.existingOne.toString() }, process.env.JWT_SECRET),
	existingTwo: jwt.sign({ _id: ids.existingTwo.toString() }, process.env.JWT_SECRET)
};
const users = {
	new: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	},
	existingOne: {
		_id: ids.existingOne,
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8),
		tokens: [
			{
				token: tokens.existingOne
			}
		]
	},
	existingTwo: {
		_id: ids.existingTwo,
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8),
		tokens: [
			{
				token: tokens.existingTwo
			}
		]
	},
	nonExisting: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	}
};
const tasks = {
	existingOne: {
		taskOne: {
			description: faker.lorem.words(rndNumber())
		},
		taskTwo: {
			_id: new mongoose.Types.ObjectId(),
			description: faker.lorem.words(rndNumber()),
			completed: true,
			owner: users.existingOne._id
		}
	},
	existingTwo: {
		taskOne: {
			_id: new mongoose.Types.ObjectId(),
			description: faker.lorem.words(rndNumber()),
			completed: false,
			owner: users.existingTwo._id
		},
		taskTwo: {
			_id: new mongoose.Types.ObjectId(),
			description: faker.lorem.words(rndNumber()),
			completed: true,
			owner: users.existingTwo._id
		},
		taskThree: {
			_id: new mongoose.Types.ObjectId(),
			description: faker.lorem.words(rndNumber()),
			completed: false,
			owner: users.existingTwo._id
		}
	}
};

// Remove then add data in database for testing
const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(users.existingOne).save();
	await new User(users.existingTwo).save();
	await new Task(tasks.existingOne.taskTwo).save();
	await new Task(tasks.existingTwo.taskOne).save();
	await new Task(tasks.existingTwo.taskTwo).save();
	await new Task(tasks.existingTwo.taskThree).save();
};

function rndNumber() {
	return Math.floor(Math.random() * 10) + 1;
}

module.exports = {
	ids,
	tokens,
	users,
	tasks,
	setupDatabase
};
