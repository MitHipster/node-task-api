const express = require('express');

require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.info(`Started on port ${port}`);
});

const bcrypt = require('bcryptjs');

const myFunction = async () => {
	const password = 'Red12345!';
	const hashed = await bcrypt.hash(password, 8);

	console.info(password, hashed);

	const isMatch = await bcrypt.compare(password, hashed);
	console.log('==>: myFunction -> isMatch', isMatch);
};

myFunction();

module.exports = app;
