const app = require('./server');

const port = process.env.PORT;

app.listen(port, () => {
	console.info(`Started on port ${port}`);
});
