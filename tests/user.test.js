/* global test beforeEach expect */
const request = require('supertest');
const faker = require('faker');

const app = require('../src/server');
const User = require('../src/models/User');
const { users, setupDatabase } = require('./fixtures/data');

console.info(users);

// Remove then add data in database for testing
beforeEach(setupDatabase);

test('Should sign up a new user', async () => {
	const response = await request(app)
		.post('/users')
		.send(users.new)
		.expect(201);

	// Assert that a user was added to database
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assert that response object contains the correct user information
	expect(response.body).toMatchObject({
		user: {
			name: users.new.name,
			email: users.new.email.toLowerCase()
		},
		token: user.tokens[0].token
	});

	// Assert that password is not stored as plain text
	expect(user.password).not.toBe(users.new.password);
});

test('Should login existing user', async () => {
	const { email, password } = users.existing;
	const response = await request(app)
		.post('/users/login')
		.send({ email, password })
		.expect(200);

	// Assert that token in response matches second token in array
	// Note: First token was add to the user object in the test data
	// the second token was added after login in
	const user = await User.findById(users.existing._id);
	expect(response.body.token).toBe(user.tokens[1].token);
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

test('Should delete a user account', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${users.existing.tokens[0].token}`)
		.send()
		.expect(200);

	// Assert that user object is not in the database
	const user = await User.findById(users.existing._id);
	expect(user).toBeNull();
});

test('Should not delete a user account', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401);
});

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${users.existing.tokens[0].token}`)
		// Provide attach with field name and path to test file
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200);

	// Assert that binary data was saved to database
	const user = await User.findById(users.existing._id);
	// toBe uses strict equality which will not work when comparing two like objects
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
	const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
	await request(app)
		.patch('/users/me')
		.send({
			name
		})
		.set('Authorization', `Bearer ${users.existing.tokens[0].token}`)
		.expect(200);

	// Assert that database contains the changed name
	const user = await User.findById(users.existing._id);
	expect(user.name).toBe(name);
});

test('Should not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${users.existing.tokens[0].token}`)
		.send({
			location: faker.address.city()
		})
		.expect(400);
});
