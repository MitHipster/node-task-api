/* global beforeEach describe it */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../server');
const Todo = require('../../models/Todo');

const todos = [
	{
		_id: new ObjectID(),
		text: 'First todo test'
	},
	{
		_id: new ObjectID(),
		text: 'Second todo test'
	},
	{
		_id: new ObjectID(),
		text: 'Third todo test'
	}
];

beforeEach(done => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos);
		})
		.then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', done => {
		const text = 'Test post route';

		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end(err => {
				if (err) {
					return done(err);
				}

				Todo.find({ text })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should not create todo with invalid data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end(err => {
				if (err) {
					return done(err);
				}

				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(3);
						done();
					})
					.catch(err => done(err));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(3);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo document', done => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[1].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', done => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if Id is invalid', done => {
		request(app)
			.get('/todos/12345')
			.expect(404)
			.end(done);
	});
});
