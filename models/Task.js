const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		maxlength: 200,
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
