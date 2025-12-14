exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: { type: 'varchar(50)', primaryKey: true },
    content: { type: 'text', notNull: true },
    thread_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"threads"(id)',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    date: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    is_delete: { type: 'boolean', notNull: true, default: false },
  });
  pgm.createIndex('comments', 'thread_id');
  pgm.createIndex('comments', 'owner');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
