const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
	try {
		// Get Bearer token from header and remove Bearer prefix
		const token = req.header('Authorization').replace('Bearer ', '');
		// Decode token using secret phrase
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// Find user with matching decoded id AND existing token in tokens array
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error();
		}

		// If user found, add user object to req object for any subsequent API requests
		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate.' });
	}
};

module.exports = auth;
