const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'tjacker31@gmail.com',
		subject: 'Node Task Manager Account',
		text: `Welcome to Node Task Manager, ${name}! We are glad you picked us for managing your tasks.`
	});
};

const cancellationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'tjacker31@gmail.com',
		subject: 'Node Task Manager Cancellation',
		text: `Dear ${name}, we are sorry to see you go. Please let us know what we could have done better.`
	});
};

module.exports = {
	welcomeEmail,
	cancellationEmail
};
