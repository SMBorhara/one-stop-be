const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();

const port = 3002;

// files and functions
const pool = require('./config').default;
const products = require('./products');
const user = require('./user');
const { get } = require('http');
require('./passport')(passport);
const cart = require('./cart');
const getOrders = require('./orders');

// parser
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(
	session({ secret: 'lucky duck', resave: false, saveUninitialized: false })
);

// middleware
app.use(passport.initialize());
app.use(passport.session());

// home page display
app.get('/onestop', (req, res) => {
	res.json('One Stop Mama');
});

// login
app.post('/onestop/login', (req, res) => {
	passport.authenticate('local', function (err, user, info) {
		// console.log(user);
		res.send(user.rows[0]);
	})(req, res);
});

// logout
// app.get('/onestop/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// });

// product list
app.get('/products', products.getProducts);

// category list
app.get('/products/:category', products.getCategory);

// product name
app.get('/products/:name', products.getProduct);

// new user register
app.post('/register', user.registerUser);

// profile info updates
app.patch('/:username/profile', user.updateProfile);

// // view user profile by username
app.get('/:username/profile', user.getProfile);

app.get('/users', async (req, res) => {
	const userList = await pool.query('SELECT * FROM users');
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
