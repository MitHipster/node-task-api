/* global test beforeEach */
const request = require('supertest');
const faker = require('faker');

const app = require('../src/server');
const User = require('../src/models/User');

const users = {
	new: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	},
	existing: {
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		email: faker.internet.email(),
		password: faker.internet.password(8)
	}
};

// Remove users from the database before testing
beforeEach(async () => {
	await User.deleteMany();
});

test('Should sign up a new user', async () => {
	await request(app)
		.post('/users')
		.send({
			name: 'Tim Acker',
			email: 'tim@example.com',
			password: 'Red12345!'
		})
		.expect(201);
});
