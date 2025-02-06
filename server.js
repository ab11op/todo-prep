const express = require('express');
const path = require('path');
const db = require('./db');
const { todos, projects } = require('./db/schema');
const { eq } = require('drizzle-orm');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Projects API Endpoints
app.get('/api/projects', async (req, res) => {
    try {
        const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
        res.json(allProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { name } = req.body;
        const [newProject] = await db.insert(projects).values({ name }).returning();
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Todos API Endpoints
app.get('/api/todos', async (req, res) => {
    try {
        const { projectId } = req.query;
        let query = db.select().from(todos);

        if (projectId) {
            query = query.where(eq(todos.projectId, parseInt(projectId)));
        }

        const allTodos = await query.orderBy(todos.createdAt);
        res.json(allTodos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const { text, projectId } = req.body;
        const [newTodo] = await db.insert(todos)
            .values({ text, projectId: projectId || null })
            .returning();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

app.patch('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed, projectId } = req.body;
        const [updatedTodo] = await db
            .update(todos)
            .set({ text, completed, projectId })
            .where(eq(todos.id, parseInt(id)))
            .returning();
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(todos).where(eq(todos.id, parseInt(id)));
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});