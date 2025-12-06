-- Create users table
CREATE TABLE IF NOT EXISTS users (
    userId SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('customer', 'artisan')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    profilePicture VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    itemId SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_price INTEGER NOT NULL, -- Price in cents
    product_picture VARCHAR(500),
    category VARCHAR(100),
    user_id INTEGER REFERENCES users(userId) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    ratingId SERIAL PRIMARY KEY,
    productId INTEGER REFERENCES items(itemId) ON DELETE CASCADE,
    userId INTEGER REFERENCES users(userId) ON DELETE CASCADE,
    ratingValue INTEGER NOT NULL CHECK (ratingValue >= 1 AND ratingValue <= 5),
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(productId, userId) -- One rating per user per product
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_ratings_product_id ON ratings(productId);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(userId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
