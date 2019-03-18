const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 100,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: -1
	}
});

module.exports = Task;
