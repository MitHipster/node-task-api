const multer = require('multer');

const upload = multer({
	dest: 'avatars'
});

module.exports = upload;
