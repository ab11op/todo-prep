const { pgTable, serial, text, boolean, timestamp } = require('drizzle-orm/pg-core');

const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

module.exports = {
  todos
};
