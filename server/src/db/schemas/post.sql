CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
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
    thumbnail TEXT,
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

CREATE TYPE squad_roles AS ENUM ('member', 'moderator');

CREATE TABLE squad_members (
    id SERIAL PRIMARY KEY,
    squad_id INT NOT NULL,
    user_id INT NOT NULL,
    role squad_roles DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);