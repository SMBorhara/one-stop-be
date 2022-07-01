const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 8000;

// files and functions
const pool = require('./config');
const products = require('./routes/products');
const user = require('./routes/user');
const register = require('./routes/register');
const { get } = require('http');
require('./passport')(passport);
const cart = require('./routes/cart');
const getOrders = require('./routes/orders');

// parser
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

//Cors enabled
app.use(cors());
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

app.use(
	session({
		secret: 'lucky duck',
		resave: false,
		saveUninitialized: false,
	})
);

// middleware
app.use(passport.initialize());
app.use(passport.session());

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
		res.send(user.rows[0]);
	})(req, res);
});

// user routes
app.post('/register', register.registerUser);
app.get('/username', user.getProfile);

// logout
// app.get('/onestop/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// });

// category list
app.get('/products/:category', products.getCategory);

// product name
app.get('/products/:name', products.getProduct);

// profile info updates
app.patch('/onestop/users/:username/profile', user.updateProfile);

// // view all usernames

app.get('/usernames', async (req, res) => {
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

app.use(express.static('public'));
app.listen(port, () => {
	console.log(`Banging my head app running on port: ${port}`);
});

/* Routes
home page - http://localhost:3002/onestop
login - http://localhost:3002/onestop/login


*/
