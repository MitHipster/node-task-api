// Used to mock SendGrid to prevent SendGrid email requests during testing
// Functions here can be left empty because actual functions have no return statement
module.exports = {
	setApiKey() {},
	send() {}
};
