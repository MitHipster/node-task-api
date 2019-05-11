/* global test */
const request = require('supertest');

const app = require('../src/server');

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
