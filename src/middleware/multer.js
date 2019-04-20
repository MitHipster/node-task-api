const multer = require('multer');

const upload = multer({
	dest: 'avatars',
	limits: {
		fileSize: 1000000 // 1 MB (in decimal)
	},
	fileFilter(req, file, cb) {
		// Accept filenames that end in png, jpg or jpeg
		if (!file.originalname.match(/\.(jpe?g|png)$/i)) {
			// Passes an error to the callback function if upload fails
			return cb(new Error('Please upload a jpg or png image'));
		}

		// Passes an undefined error and true on success
		cb(undefined, true);
	}
});

module.exports = upload;
