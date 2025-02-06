const express = require('express');
const path = require('path');
const db = require('./db');
const { todos, projects } = require('./db/schema');
const { eq, isNull, and } = require('drizzle-orm');

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
        const { projectId, parentId } = req.query;
        let query = db.select().from(todos);

        if (projectId) {
            query = query.where(eq(todos.projectId, parseInt(projectId)));
        }

        if (parentId === 'null') {
            query = query.where(isNull(todos.parentId));
        } else if (parentId) {
            query = query.where(eq(todos.parentId, parseInt(parentId)));
        }

        const allTodos = await query.orderBy(todos.order);
        res.json(allTodos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const { text, projectId, parentId } = req.body;

        // Get the maximum order for siblings
        const siblingsQuery = db.select({ maxOrder: todos.order })
            .from(todos)
            .where(
                parentId 
                    ? eq(todos.parentId, parentId)
                    : and(
                        isNull(todos.parentId),
                        projectId ? eq(todos.projectId, projectId) : isNull(todos.projectId)
                    )
            )
            .orderBy(todos.order);

        const siblings = await siblingsQuery;
        const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.maxOrder)) : -1;

        const [newTodo] = await db.insert(todos)
            .values({ 
                text, 
                projectId: projectId || null,
                parentId: parentId || null,
                order: maxOrder + 1
            })
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
        const { text, completed, projectId, parentId, order } = req.body;
        const [updatedTodo] = await db
            .update(todos)
            .set({ text, completed, projectId, parentId, order })
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

        // First, recursively delete all subtasks
        const deleteSubtasks = async (parentId) => {
            const subtasks = await db.select().from(todos).where(eq(todos.parentId, parentId));
            for (const subtask of subtasks) {
                await deleteSubtasks(subtask.id);
                await db.delete(todos).where(eq(todos.id, subtask.id));
            }
        };

        await deleteSubtasks(parseInt(id));
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