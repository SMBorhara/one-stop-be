const pool = require('../config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// view profile by username
const getProfile = async (req, res) => {
	try {
		const { username } = req.body;
		console.log(username);
		const userProfile = await pool.query(
			'SELECT * FROM users WHERE username = $1',
			[username]
		);
		console.log(userProfile);
		res.json(userProfile.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
};

// update profile
const updateProfile = async (req, res) => {
	try {
		console.log(req.params);
		const { username } = req.params;
		const email = req.body.email;
		const address = req.body.address;
		const phone = req.body.phone;

		const emailInfo = await pool.query(
			'UPDATE users SET email = $1 WHERE username = $2',
			[email, username]
		);
		const addressInfo = await pool.query(
			'UPDATE users SET address = $1 WHERE username = $2',
			[address, username]
		);
		const phoneInfo = await pool.query(
			'UPDATE users SET phone = $1 WHERE username = $2',
			[phone, username]
		);

		res.json('Profile updated');
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = {
	updateProfile,
	getProfile,
};
