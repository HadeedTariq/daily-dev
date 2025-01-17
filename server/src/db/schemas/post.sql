CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    squad_id INT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (squad_id) REFERENCES squads (id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE
);

CREATE TABLE comment_replies (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE
);

CREATE TABLE post_upvotes (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment_upvotes (
    id SERIAL PRIMARY KEY,
    comment_id INT REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_comment_user UNIQUE (comment_id, user_id)
);

CREATE TABLE post_views (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE post_content AS ENUM ('members', 'moderators');

CREATE TYPE squad_category AS ENUM (
    'frontend',
    'backend',
    'full-stack',
    'devops',
    'data-science',
    'AI',
    'mobile',
    'cloud',
    'security',
    'quality-assurance',
    'general'
);

CREATE TABLE squads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    squad_handle VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    thumbnail TEXT DEFAULT 'https://img.freepik.com/free-photo/user-icon-front-side-white-background_187299-40226.jpg?t=st=1735790338~exp=1735793938~hmac=94a72501b7f761f634e532f88e25ab145272e0d37cde6be342971cd4f6ec9ad4&w=1800',
    category squad_category DEFAULT 'general',
    is_public BOOLEAN DEFAULT TRUE,
    admin_id INT NOT NULL,
    post_creation_allowed_to post_content DEFAULT 'members',
    invitation_permission post_content DEFAULT 'members',
    post_approval_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TYPE squad_roles AS ENUM ('member', 'moderator', 'admin');

CREATE TABLE squad_members (
    id SERIAL PRIMARY KEY,
    squad_id INT NOT NULL,
    user_id INT NOT NULL,
    role squad_roles DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);