const express = require('express');
const session = require('express-session');

const bcrypt = require('bcrypt');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cors = require('cors');
const pool = require('./config');
require('dotenv').config();
const path = require('path');

const authRouter = require('./auth');

// files and functions

const products = require('./routes/products');
const user = require('./routes/user');
const register = require('./routes/register');
const { get } = require('http');
require('./passport')(passport);
const cart = require('./routes/cart');
const getOrders = require('./routes/orders');

const app = express();
const port = process.env.PORT || 8000;

// parser
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

//Cors enabled
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header(
		'Access-Control-Allow-Methods',
		'POST, GET, PATCH, DELETE, OPTIONS'
	);
	next();
});

// session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: {},
		resave: false,
		saveUninitialized: false,
	})
);

if (app.get('env') === 'production') {
	// Serve secure cookies, requires HTTPS
	session.cookie.secure = true;
}

// passport
const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL,
	},
	(accessToken, refreshToken, extraParams, profile, done) => {
		return done(null, profile);
	}
);
// app configuration
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

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

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

app.use('/', authRouter);

// home page display
app.get('/', (req, res) => {
	res.json('One Stop Mama');
});

// product list
app.get('/products', products.getProducts);

// login
app.post('/login', (req, res) => {
	passport.authenticate('local', function (err, user, info) {
		// console.log(user);
		res.send(user.rows);
	})(req, res);
});

// user routes
app.post('/register', register.registerUser);
app.get('/profile', user.getProfile);

// logout
// app.get('/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// });

// category list
app.get('/products/:category', products.getCategory);

// product name
app.get('/products/:name', products.getProduct);

// profile info updates
app.patch('/profile', user.updateProfile);

// // view all usernames

app.get('/users', async (req, res) => {
	const userList = await pool.query('SELECT username FROM users');
	console.log(userList.rows);
	res.json(userList.rows);
});

// cart routes
app.post('/:username/cartadd', cart.addCartItems);
app.patch('/:username/carttotal', cart.itemTotal);

// checkout
app.get('/:username/checkout', cart.checkout);
app.post('/:username/checkout/payment', cart.payment);

// orders
app.get('/:username/orders', getOrders.getOrders);

app.listen(port, () => {
	console.log(`Banging my head app running on port: ${port}`);
});
