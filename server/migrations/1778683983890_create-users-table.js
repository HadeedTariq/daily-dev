exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    name: {
      type: "varchar(100)",
      notNull: true,
    },

    username: {
      type: "varchar(100)",
      notNull: true,
    },

    avatar: {
      type: "varchar(255)",
      default:
        "https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg",
    },

    email: {
      type: "varchar(100)",
      unique: true,
      notNull: true,
    },

    profession: {
      type: "varchar(100)",
    },

    user_password: {
      type: "varchar(255)",
    },

    refresh_token: {
      type: "varchar(255)",
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    is_verified: {
      type: "boolean",
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
