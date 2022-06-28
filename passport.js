const bcrypt = require('bcrypt');
const pool = require('./config')
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'username' },
			async (username, password, done) => {
				userMatch = await pool.query('SELECT * FROM users WHERE username=$1', [
					username,
				]);
				if (!userMatch) {
					return done(null, false, { message: 'username not found' });
				}
				userPass = await pool.query(
					'SELECT password FROM users WHERE username=$1',
					[username]
				);

				bcrypt.compare(password, userPass.rows[0].password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						return done(null, userMatch);
					} else {
						return done(null, false, { message: 'incorrect password' });
					}
				});
			}
		)
	);

	passport.serializeUser(function (user, done) {
		console.log('serialize user is executing');
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		pool.query(
			'SELECT id, username FROM users WHERE id = $1',
			[parseInt(id, 10)],
			(err, results) => {
				if (err) {
					return done(err);
				}

				done(null, results.rows[0]);
			}
		);
	});
};
