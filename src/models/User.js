const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		minlength: 1,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Please provide a valid email address.');
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Your password cannot contain "password".');
			}
		}
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

// Creates a custom function and adds it to the user schema - this is a method on the model
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login.');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Unable to login.');
	}

	return user;
};

// Generates a token for the authenticated user and saves to the user document - this is a method on the instance
userSchema.methods.generateAuthToken = async function() {
	const user = this;
	// Need to convert the user object to a string
	const token = jwt.sign({ _id: user._id.toString() }, 'pandabreakfastmountainsocks');

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

/**
 * Sanitizes the user object by removing private information before returning to the frontend.
 * NOTE: This method is NOT called directly. Instead it is called automatically before express
 * converts the object to a string prior to sending.
 */
userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

// Second argument needs to be a standard function rather then an arrow function
userSchema.pre('save', async function(next) {
	// this refers to the user document
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	// Call next to proceed in the process
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
