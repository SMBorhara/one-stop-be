const pool = require('../config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// register new user
const registerUser = async (req, res) => {
	let id = uuidv4();

	try {
		const { username } = req.body;
		const { password } = req.body;
		console.log(req.body);
		const user = await pool.query('SELECT username FROM users');
		console.log(user);
		console.log(password);
		if (!user) {
			res.send('username already taken').redirect('/register');
		} else {
			//hash password
			const salt = await bcrypt.genSalt(5);
			const hashedPass = await bcrypt.hash(password, salt);
			const newUser = await pool.query(
				'INSERT INTO users (id, username, password) VALUES($1, $2, $3) RETURNING *',
				[id, username, hashedPass]
			);

			// res.redirect(`${username}/profile`);
			res.json(`${username} created!`);
		}
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = { registerUser };
