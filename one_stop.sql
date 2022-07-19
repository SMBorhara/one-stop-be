CREATE TABLE users(
    id UUID,
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50),
    password VARCHAR(100)
    
);

CREATE TABLE user_info(
    
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    street VARCHAR(10),
    city VARCHAR(20),
    state VARCHAR(15),
    zip VARCHAR(10)
);


CREATE TABLE products(
    category_id INTEGER,
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
        
);
