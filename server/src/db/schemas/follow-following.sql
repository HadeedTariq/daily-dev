CREATE TABLE followers (
    follower_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT chk_follower_self_follow CHECK (follower_id != followed_id)
);

CREATE TABLE follow_notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(10) NOT NULL CHECK (action_type IN ('follow', 'unfollow')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE (user_id, actor_id, action_type)
);