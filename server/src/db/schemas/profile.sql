CREATE TABLE about (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    bio VARCHAR(255),
    company VARCHAR(255),
    job_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    github VARCHAR(255),
    linkedin VARCHAR(255),
    your_website VARCHAR(255),
    x VARCHAR(255),
    youtube VARCHAR(255),
    stack_overflow VARCHAR(255),
    reddit VARCHAR(255),
    roadmap_sh VARCHAR(255),
    codepen VARCHAR(255),
    mastodon VARCHAR(255),
    threads VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);