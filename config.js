// env file
require('dotenv').config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';


const connectionString = `postgres://${process.env.DB_USER}:@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
	ssl: false,
});

module.exports = pool;

// const devConfig = {
// 	user: process.env.DB_USER,
// 	host: process.env.DB_HOST,
// 	database: process.env.DB_DATABASE,
// 	port: process.env.DB_PORT,
// };

// const proConfig = {
// 	connectionString: process.env.DATABASE_URL,
// };

// const pool = new Pool(
// 	process.env.NODE_ENV === 'production' ? proConfig : devConfig
// );

// module.exports = pool;
