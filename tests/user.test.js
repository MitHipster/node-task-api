/* global test beforeEach */
const request = require('supertest');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/server');
const User = require('../src/models/User');

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

console.info(users);

// Remove users from the database before testing
beforeEach(async () => {
	await User.deleteMany();
	await new User(users.existing).save();
});

test('Should sign up a new user', async () => {
	await request(app)
		.post('/users')
		.send(users.new)
		.expect(201);
});

test('Should login existing user', async () => {
	const { email, password } = users.existing;
	await request(app)
		.post('/users/login')
		.send({ email, password })
		.expect(200);
});

test('Should not login non-existent user', async () => {
	const { email, password } = users.nonExisting;
	await request(app)
		.post('/users/login')
		.send({ email, password })
		.expect(400);
});

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${users.existing.tokens[0].token}`)
		.send()
		.expect(200);
});

test('Should not get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401);
});
