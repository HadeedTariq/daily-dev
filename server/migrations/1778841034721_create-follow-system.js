exports.up = (pgm) => {
  pgm.createTable(
    "followers",
    {
      follower_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },

      followed_id: {
        type: "integer",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },

      created_at: {
        type: "timestamptz",
        default: pgm.func("now()"),
        notNull: true,
      },
    },
    {
      constraints: {
        primaryKey: ["follower_id", "followed_id"],
      },
    },
  );

  pgm.createTable("follow_notifications", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    actor_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    action_type: {
      type: "varchar(20)",
      default: "follow",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
      notNull: true,
    },

    is_read: {
      type: "boolean",
      default: false,
      notNull: true,
    },
  });

  pgm.addConstraint("follow_notifications", "unique_follow_notification", {
    unique: ["user_id", "actor_id", "action_type"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("follow_notifications");
  pgm.dropTable("followers");
};
