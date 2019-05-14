/* global test beforeEach expect */
const request = require('supertest');

const app = require('../src/server');
const Task = require('../src/models/Task');
const { users, tasks, setupDatabase } = require('./fixtures/data');

console.info(users);
console.info(tasks);

// Remove then add data in database for testing
beforeEach(setupDatabase);

test('Should create task for user', async () => {
	const response = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${users.existingOne.tokens[0].token}`)
		.send({
			description: tasks.existingOne.taskOne.description
		})
		.expect(201);

	// Assert that task was saved to database
	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();

	// Assert task completed to be false
	expect(task.completed).toEqual(false);
});

test('Should get all tasks for user', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${users.existingTwo.tokens[0].token}`)
		.send()
		.expect(200);

	// Assert the correct number of tasks received
	expect(response.body.length).toBe(3);
});

test('Should not delete another users tasks', async () => {
	await request(app)
		.delete(`/tasks/${tasks.existingOne.taskTwo._id}`)
		.set('Authorization', `Bearer ${users.existingTwo.tokens[0].token}`)
		.send()
		.expect(404);

	// Assert that task is still in database
	const task = await Task.findById(tasks.existingOne.taskTwo._id);
	expect(task).not.toBeNull();
});
