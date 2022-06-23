const pool = require('../config').default;

// cart items
const addCartItems = async (req, res) => {
	try {
		const { username } = req.params;
		const { product_name } = req.body;
		const { product_quantity } = req.body;

		// get product price from product table
		const productPrice = await pool.query(
			'SELECT price FROM products WHERE name=$1',
			[product_name]
		);

		// single price
		let price = productPrice.rows[0].price;
		console.log(price);

		// add items to cart
		let cartItems = await pool.query(
			'INSERT INTO cart (user_id, product_name, product_quantity, product_price) VALUES($1, $2, $3, $4)',
			[username, product_name, product_quantity, price]
		);

		res.json('Items added!');
	} catch (error) {
		console.error(error);
	}
};

const itemTotal = async (req, res) => {
	try {
		const { username } = req.params;

		// calculate subtotal
		let quantPrice = await pool.query(
			'SELECT product_quantity*product_price AS subtotal FROM cart WHERE user_id=$1',
			[username]
		);

		// total price of item by quantity
		let subTotal = quantPrice.rows[1].subtotal;
		console.log(subTotal);

		// total amt of items inserted in table
		const udpateTotal = await pool.query(
			'UPDATE cart SET total_amt=$1 WHERE user_id=$2',
			[subTotal, username]
		);

		const cart = await pool.query('SELECT * FROM cart WHERE user_id=$1', [
			username,
		]);
		let userCart = cart.rows;
		res.json(userCart);
	} catch (error) {
		console.error(error);
	}
};

const checkout = async (req, res) => {
	try {
		const { username } = req.params;

		// cart validate
		const cartCheck = await pool.query(
			'SELECT SUM(total_amt) AS cartTotal FROM cart WHERE user_id=$1',
			[username]
		);

		let total = cartCheck.rows[0].carttotal;
		console.log(total);

		if (total > '$0') {
			res.json(`Your total is ${total}, please submit payment:`);
		}
	} catch (error) {
		console.error(error.message);
	}
};

const payment = async (req, res) => {
	try {
		const { cc } = req.body;
		const { date } = req.body;
		const { username } = req.params;

		if (cc.length > 15 || cc.length < 15) {
			res
				.send('Please submit valid payment')
				.redirect('/:username/checkout/payment');
		} else {
			const submitOrder = await pool.query(
				'INSERT INTO orders (order_date, user_id) VALUES($1, $2)',
				[date, username]
			);
			res.send(
				'Payment submitted, you can view all orders on your order page.'
			);
		}
	} catch (error) {
		console.error(error.message);
	}
};

module.exports = {
	addCartItems,
	itemTotal,
	checkout,
	payment,
};
