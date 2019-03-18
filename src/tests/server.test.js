/* global beforeEach describe it */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../server');
const Task = require('../../models/Task');

const tasks = [
	{
		_id: new ObjectID(),
		task: 'First task test'
	},
	{
		_id: new ObjectID(),
		task: 'Second task test'
	},
	{
		_id: new ObjectID(),
		task: 'Third task test'
	}
];

beforeEach(done => {
	Task.remove({})
		.then(() => {
			return Task.insertMany(tasks);
		})
		.then(() => done());
});

describe('POST /tasks', () => {
	it('should create a new task', done => {
		const task = 'Test post route';

		request(app)
			.post('/tasks')
			.send({ task })
			.expect(200)
			.expect(res => {
				expect(res.body.task).toBe(task);
			})
			.end(err => {
				if (err) {
					return done(err);
				}

				Task.find({ task })
					.then(tasks => {
						expect(tasks.length).toBe(1);
						expect(tasks[0].task).toBe(task);
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should not create task with invalid data', done => {
		request(app)
			.post('/tasks')
			.send({})
			.expect(400)
			.end(err => {
				if (err) {
					return done(err);
				}

				Task.find()
					.then(tasks => {
						expect(tasks.length).toBe(3);
						done();
					})
					.catch(err => done(err));
			});
	});
});

describe('GET /tasks', () => {
	it('should get all tasks', done => {
		request(app)
			.get('/tasks')
			.expect(200)
			.expect(res => {
				expect(res.body.tasks.length).toBe(3);
			})
			.end(done);
	});
});

describe('GET /tasks/:id', () => {
	it('should return task document', done => {
		request(app)
			.get(`/tasks/${tasks[1]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.task.task).toBe(tasks[1].task);
			})
			.end(done);
	});

	it('should return 404 if task not found', done => {
		request(app)
			.get(`/tasks/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if Id is invalid', done => {
		request(app)
			.get('/tasks/12345')
			.expect(404)
			.end(done);
	});
});
