const pool = require('./config').default;

// view all products
const getProducts = async (req, res) => {
	try {
		const productList = await pool.query('SELECT * FROM products');
		res.json(productList.rows);
	} catch (err) {
		console.error(err.message);
	}
};

// product by category
const getCategory = async (req, res) => {
	try {
		const { category } = req.params;
		console.log(category);
		const categoryList = await pool.query(
			'SELECT * FROM products WHERE category = $1',
			[category]
		);
		console.log(categoryList);
		res.json(categoryList.rows);
	} catch (err) {
		console.error(err.message);
	}
};

// product by name
const getProduct = async (req, res) => {
	try {
		const { name } = req.params;

		const product = await pool.query('SELECT * FROM products WHERE name = $1', [
			name,
		]);

		res.json(product.rows);
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = {
	getProducts,
	getCategory,
	getProduct,
};
