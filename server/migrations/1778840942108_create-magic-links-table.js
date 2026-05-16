exports.up = (pgm) => {
  pgm.createTable("magicLinks", {
    email: {
      type: "varchar(100)",
      unique: true,
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    token: {
      type: "varchar(1000)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("magicLinks");
};
