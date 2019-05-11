/* global test beforeEach */
const request = require('supertest');

const app = require('../src/server');
const User = require('../src/models/User');

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
