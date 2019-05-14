const faker = require('faker');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/User');

const ids = {
	existing: new mongoose.Types.ObjectId()
};
const tokens = {
	existing: jwt.sign({ _id: ids.existing.toString() }, process.env.JWT_SECRET)
};
const users = {
	new: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	},
	existing: {
		_id: ids.existing,
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8),
		tokens: [
			{
				token: tokens.existing
			}
		]
	},
	nonExisting: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	}
};

// Remove then add data in database for testing
const setupDatabase = async () => {
	await User.deleteMany();
	await new User(users.existing).save();
};

module.exports = {
	ids,
	tokens,
	users,
	setupDatabase
};
