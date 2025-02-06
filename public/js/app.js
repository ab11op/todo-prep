class TodoApp {
    constructor() {
        this.todos = [];
        this.projects = [];
        this.currentProjectId = null;

        // Form elements
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.tasksCount = document.getElementById('tasks-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.taskTemplate = document.getElementById('task-template');

        // Project elements
        this.projectSelect = document.getElementById('project-select');
        this.newProjectBtn = document.getElementById('new-project-btn');
        this.newProjectModal = new bootstrap.Modal(document.getElementById('new-project-modal'));
        this.newProjectForm = document.getElementById('new-project-form');
        this.projectNameInput = document.getElementById('project-name');
        this.saveProjectBtn = document.getElementById('save-project-btn');

        this.bindEvents();
        this.fetchProjects().then(() => this.fetchTodos());
    }

    bindEvents() {
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        this.todoList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            const todoId = li.dataset.id;

            if (e.target.classList.contains('delete-task')) {
                this.deleteTodo(todoId);
            } else if (e.target.classList.contains('edit-task') || e.target.closest('.edit-task')) {
                this.editTodo(todoId);
            } else if (e.target.classList.contains('task-check')) {
                this.toggleTodo(todoId);
            }
        });

        this.projectSelect.addEventListener('change', () => {
            this.currentProjectId = this.projectSelect.value || null;
            this.fetchTodos();
        });

        this.newProjectBtn.addEventListener('click', () => {
            this.newProjectModal.show();
        });

        this.saveProjectBtn.addEventListener('click', () => {
            this.addProject();
        });
    }

    async fetchProjects() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();
            this.renderProjectSelect();
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    async fetchTodos() {
        try {
            const url = this.currentProjectId 
                ? `/api/todos?projectId=${this.currentProjectId}`
                : '/api/todos';
            const response = await fetch(url);
            this.todos = await response.json();
            this.render();
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    renderProjectSelect() {
        this.projectSelect.innerHTML = '<option value="">All Projects</option>';
        this.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            this.projectSelect.appendChild(option);
        });
    }

    async addProject() {
        const name = this.projectNameInput.value.trim();
        if (!name) return;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            const newProject = await response.json();
            this.projects.push(newProject);
            this.renderProjectSelect();
            this.projectNameInput.value = '';
            this.newProjectModal.hide();
        } catch (error) {
            console.error('Error adding project:', error);
        }
    }

    updateTasksCount() {
        const remainingTasks = this.todos.filter(todo => !todo.completed).length;
        this.tasksCount.textContent = `${remainingTasks} item${remainingTasks !== 1 ? 's' : ''} left`;
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    projectId: this.currentProjectId
                }),
            });
            const newTodo = await response.json();
            this.todos.push(newTodo);
            this.todoInput.value = '';
            this.render();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async deleteTodo(id) {
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });
            this.todos = this.todos.filter(todo => todo.id !== parseInt(id));
            this.render();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === parseInt(id));
        if (todo) {
            try {
                const response = await fetch(`/api/todos/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: todo.text,
                        completed: !todo.completed,
                        projectId: todo.projectId
                    }),
                });
                const updatedTodo = await response.json();
                this.todos = this.todos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
                this.render();
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
    }

    editTodo(id) {
        const li = this.todoList.querySelector(`li[data-id="${id}"]`);
        const taskText = li.querySelector('.task-text');
        const todo = this.todos.find(todo => todo.id === parseInt(id));

        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'task-edit-input';

        taskText.replaceWith(input);
        input.focus();

        const saveEdit = async () => {
            const newText = input.value.trim();
            if (newText && newText !== todo.text) {
                try {
                    const response = await fetch(`/api/todos/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            text: newText,
                            completed: todo.completed,
                            projectId: todo.projectId
                        }),
                    });
                    const updatedTodo = await response.json();
                    this.todos = this.todos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
                    this.render();
                } catch (error) {
                    console.error('Error updating todo:', error);
                }
            } else {
                this.render();
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                this.render();
            }
        });
    }

    async clearCompleted() {
        const completedTodos = this.todos.filter(todo => todo.completed);
        try {
            await Promise.all(
                completedTodos.map(todo =>
                    fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
                )
            );
            this.todos = this.todos.filter(todo => !todo.completed);
            this.render();
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    }

    render() {
        this.todoList.innerHTML = '';

        this.todos.forEach(todo => {
            const clone = this.taskTemplate.content.cloneNode(true);
            const li = clone.querySelector('li');
            const checkbox = clone.querySelector('.task-check');
            const taskText = clone.querySelector('.task-text');

            li.dataset.id = todo.id;
            checkbox.checked = todo.completed;
            taskText.textContent = todo.text;

            if (todo.completed) {
                taskText.classList.add('completed');
            }

            this.todoList.appendChild(clone);
        });

        this.updateTasksCount();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});