exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: { type: 'varchar(50)', primaryKey: true },
    title: { type: 'text', notNull: true },
    body: { type: 'text', notNull: true },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    date: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('threads', 'owner');
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
