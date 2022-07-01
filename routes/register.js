const pool = require('../config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// register new user
const registerUser = async (req, res) => {
	let id = uuidv4();

	try {
		const { email } = req.body;
		const { username } = req.body;
		const { password } = req.body;
		console.log(username);
		const userCheck = await pool.query(
			'SELECT username FROM users WHERE username = $1',
			[username]
		);
		const userName = userCheck.rows;
		console.log(userName);

		// console.log(password);
		if (userName.length) {
			res.sendStatus(409);
		} else {
			//hash password
			const salt = await bcrypt.genSalt(5);
			const hashedPass = await bcrypt.hash(password, salt);
			const newUser = await pool.query(
				'INSERT INTO users (id, username, password, email) VALUES($1, $2, $3, $4) RETURNING *',
				[id, username, hashedPass, email]
			);

			res.json(`${username} created!`);
		}
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = { registerUser };
