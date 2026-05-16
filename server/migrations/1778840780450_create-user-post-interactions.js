exports.up = (pgm) => {
  pgm.createTable("user_upvotes", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "CASCADE",
    },

    post_id: {
      type: "integer",
      references: "posts(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("user_upvotes", "unique_user_post_upvote", {
    unique: ["user_id", "post_id"],
  });

  pgm.createTable("user_views", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "CASCADE",
    },

    post_id: {
      type: "integer",
      references: "posts(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("user_views", "unique_user_post_view", {
    unique: ["user_id", "post_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("user_views");
  pgm.dropTable("user_upvotes");
};
