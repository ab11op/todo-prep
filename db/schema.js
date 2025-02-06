const { pgTable, serial, text, boolean, timestamp, integer } = require('drizzle-orm/pg-core');

const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  projectId: integer('project_id').references(() => projects.id)
});

module.exports = {
  todos,
  projects
};