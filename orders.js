const pool = require('./config').default;

const getOrders = async (req, res) => {
	try {
		const orders = await pool.query(
			'SELECT * FROM cart JOIN orders ON cart.user_id = orders.user_id'
		);

		res.json(orders.rows);
	} catch (error) {
		console.error(error.message);
	}
};

module.exports = { getOrders };
