exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: { type: 'varchar(50)', primaryKey: true },
    content: { type: 'text', notNull: true },
    comment_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"comments"(id)',
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
  pgm.createIndex('replies', 'comment_id');
  pgm.createIndex('replies', 'owner');
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
