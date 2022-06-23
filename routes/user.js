const pool = require('../config').default;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// register new user
const registerUser = async (req, res) => {
	let id = uuidv4();

	try {
		const { username } = req.body;
		const { password } = req.body;

		const user = await pool.query('SELECT username FROM users');
		console.log(user);

		if (user) {
			res.send('username already taken').redirect('/register');
		} else {
			//hash password
			const salt = await bcrypt.genSalt(5);
			const hashedPass = await bcrypt.hash(password, salt);
			const newUser = await pool.query(
				'INSERT INTO users (id, username, password) VALUES($1, $2, $3) RETURNING *',
				[id, username, hashedPass]
			);

			res.json(newUser.rows[0]);
		}
	} catch (err) {
		console.error(err.message);
	}
};

// update profile

const updateProfile = async (req, res) => {
	try {
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

// view profile by username
const getProfile = async (req, res) => {
	try {
		const { username } = req.params;
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

module.exports = {
	registerUser,
	updateProfile,
	getProfile,
};
