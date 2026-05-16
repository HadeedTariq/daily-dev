exports.up = (pgm) => {
  pgm.createTable("about", {
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

    bio: {
      type: "varchar(255)",
      default: "",
    },

    company: {
      type: "varchar(255)",
      default: "",
    },

    readme: {
      type: "text",
      default: "",
    },

    job_title: {
      type: "varchar(255)",
      default: "",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("about", "user_id", {
    name: "unique_about_user_id",
    unique: true,
  });

  pgm.createTable("social_links", {
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

    github: {
      type: "varchar(255)",
      default: "",
    },

    linkedin: {
      type: "varchar(255)",
      default: "",
    },

    website: {
      type: "varchar(255)",
      default: "",
    },

    x: {
      type: "varchar(255)",
      default: "",
    },

    youtube: {
      type: "varchar(255)",
      default: "",
    },

    stack_overflow: {
      type: "varchar(255)",
      default: "",
    },

    reddit: {
      type: "varchar(255)",
      default: "",
    },

    roadmap_sh: {
      type: "varchar(255)",
      default: "",
    },

    codepen: {
      type: "varchar(255)",
      default: "",
    },

    mastodon: {
      type: "varchar(255)",
      default: "",
    },

    threads: {
      type: "varchar(255)",
      default: "",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("social_links", "user_id", {
    name: "unique_social_links_user_id",
    unique: true,
  });

  pgm.createTable("user_stats", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    followers: {
      type: "integer",
      default: 0,
    },

    following: {
      type: "integer",
      default: 0,
    },

    reputation: {
      type: "integer",
      default: 0,
    },

    views: {
      type: "integer",
      default: 0,
    },

    upvotes: {
      type: "integer",
      default: 0,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("user_stats", "user_id", {
    name: "unique_user_stats_user_id",
    unique: true,
  });

  pgm.createTable("streaks", {
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

    streak_start: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    streak_end: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    streak_length: {
      type: "integer",
      default: 1,
    },

    longest_streak: {
      type: "integer",
      default: 1,
    },
  });

  pgm.createIndex("streaks", "user_id", {
    name: "unique_streaks_user_id",
    unique: true,
  });
};

exports.down = (pgm) => {
  pgm.dropIndex("streaks", "user_id", {
    name: "unique_streaks_user_id",
  });

  pgm.dropIndex("user_stats", "user_id", {
    name: "unique_user_stats_user_id",
  });

  pgm.dropIndex("social_links", "user_id", {
    name: "unique_social_links_user_id",
  });

  pgm.dropIndex("about", "user_id", {
    name: "unique_about_user_id",
  });

  pgm.dropTable("streaks");
  pgm.dropTable("user_stats");
  pgm.dropTable("social_links");
  pgm.dropTable("about");
};
