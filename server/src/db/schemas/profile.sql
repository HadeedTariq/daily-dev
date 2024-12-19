CREATE TABLE about (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    bio VARCHAR(255) DEFAULT '',
    company VARCHAR(255) DEFAULT '',
    job_title VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    github VARCHAR(255) DEFAULT '',
    linkedin VARCHAR(255) DEFAULT '',
    your_website VARCHAR(255) DEFAULT '',
    x VARCHAR(255) DEFAULT '',
    youtube VARCHAR(255) DEFAULT '',
    stack_overflow VARCHAR(255) DEFAULT '',
    reddit VARCHAR(255) DEFAULT '',
    roadmap_sh VARCHAR(255) DEFAULT '',
    codepen VARCHAR(255) DEFAULT '',
    mastodon VARCHAR(255) DEFAULT '',
    threads VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);