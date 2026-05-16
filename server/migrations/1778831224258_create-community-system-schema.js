exports.up = (pgm) => {
  pgm.createType("post_content", ["members", "moderators"]);

  pgm.createType("squad_category", [
    "frontend",
    "backend",
    "full-stack",
    "devops",
    "data-science",
    "AI",
    "mobile",
    "cloud",
    "security",
    "quality-assurance",
    "general",
  ]);

  pgm.createType("squad_roles", ["member", "moderator", "admin"]);

  pgm.createTable("tags", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    name: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },
  });

  pgm.createTable("squads", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    name: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },

    squad_handle: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },

    description: {
      type: "text",
    },

    thumbnail: {
      type: "text",
      default:
        "https://img.freepik.com/free-photo/user-icon-front-side-white-background_187299-40226.jpg?t=st=1735790338~exp=1735793938~hmac=94a72501b7f761f634e532f88e25ab145272e0d37cde6be342971cd4f6ec9ad4&w=1800",
    },

    category: {
      type: "squad_category",
      default: "general",
    },

    is_public: {
      type: "boolean",
      default: true,
    },

    admin_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    post_creation_allowed_to: {
      type: "post_content",
      default: "members",
    },

    invitation_permission: {
      type: "post_content",
      default: "members",
    },

    post_approval_required: {
      type: "boolean",
      default: false,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createTable("posts", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    slug: {
      type: "varchar(255)",
      notNull: true,
    },

    thumbnail: {
      type: "varchar(500)",
      notNull: true,
    },

    tags: {
      type: "text[]",
    },

    content: {
      type: "text",
      notNull: true,
    },

    squad_id: {
      type: "integer",
      notNull: true,
      references: "squads(id)",
      onDelete: "CASCADE",
    },

    author_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createTable("post_comments", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    post_id: {
      type: "integer",
      notNull: true,
      references: "posts(id)",
      onDelete: "CASCADE",
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    content: {
      type: "text",
      notNull: true,
      check: "char_length(content) > 0",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    edited: {
      type: "boolean",
      default: false,
    },
  });

  pgm.createTable("comment_replies", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    comment_id: {
      type: "integer",
      notNull: true,
      references: "post_comments(id)",
      onDelete: "CASCADE",
    },

    sender_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    recipient_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "CASCADE",
    },

    content: {
      type: "text",
      notNull: true,
      check: "char_length(content) > 0",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    edited: {
      type: "boolean",
      default: false,
    },
  });

  pgm.createTable("post_upvotes", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    post_id: {
      type: "integer",
      references: "posts(id)",
      onDelete: "CASCADE",
    },

    upvotes: {
      type: "integer",
      default: 0,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("post_upvotes", "post_id", {
    name: "idx_post_upvotes_post_id",
    unique: true,
  });

  pgm.createTable("comment_upvotes", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    comment_id: {
      type: "integer",
      references: "post_comments(id)",
      onDelete: "CASCADE",
    },

    user_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("comment_upvotes", "unique_comment_user", {
    unique: ["comment_id", "user_id"],
  });

  pgm.createTable("post_views", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    post_id: {
      type: "integer",
      references: "posts(id)",
      onDelete: "CASCADE",
    },

    views: {
      type: "integer",
      default: 0,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("post_views", "post_id", {
    name: "idx_post_views_post_id",
    unique: true,
  });

  pgm.createTable("squad_members", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    squad_id: {
      type: "integer",
      notNull: true,
      references: "squads(id)",
      onDelete: "CASCADE",
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    role: {
      type: "squad_roles",
      default: "member",
    },

    joined_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("squad_members", "squad_id", {
    name: "idx_squad_id",
  });
};

exports.down = (pgm) => {
  pgm.dropIndex("squad_members", "squad_id", {
    name: "idx_squad_id",
  });

  pgm.dropIndex("post_views", "post_id", {
    name: "idx_post_views_post_id",
  });

  pgm.dropIndex("post_upvotes", "post_id", {
    name: "idx_post_upvotes_post_id",
  });

  pgm.dropTable("squad_members");
  pgm.dropTable("post_views");
  pgm.dropTable("comment_upvotes");
  pgm.dropTable("post_upvotes");
  pgm.dropTable("comment_replies");
  pgm.dropTable("post_comments");
  pgm.dropTable("posts");
  pgm.dropTable("squads");
  pgm.dropTable("tags");

  pgm.dropType("squad_roles");
  pgm.dropType("squad_category");
  pgm.dropType("post_content");
};
