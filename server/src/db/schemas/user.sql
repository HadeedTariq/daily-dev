CREATE  TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar VARCHAR(255)  default 'https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg',
    email VARCHAR(100) UNIQUE NOT NULL,
    profession VARCHAR(100) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);
