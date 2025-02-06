class TodoApp {
    constructor() {
        this.todos = [];
        this.projects = [];
        this.currentProjectId = null;
        this.currentView = 'list';
        
        // Theme toggle
        this.themeToggle = document.getElementById('theme-toggle');
        this.viewModeSelect = document.getElementById('view-mode');
        this.searchInput = document.getElementById('search-input');

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
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.themeToggle.innerHTML = `<i class="bi bi-${newTheme === 'dark' ? 'moon-stars' : 'sun'}"></i>`;
        });
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        this.themeToggle.innerHTML = `<i class="bi bi-${savedTheme === 'dark' ? 'moon-stars' : 'sun'}"></i>`;

        // View mode
        this.viewModeSelect.addEventListener('change', (e) => {
            this.currentView = e.target.value;

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                this.todoInput.focus();
            } else if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.newProjectModal.show();
            } else if (e.key === '/') {
                e.preventDefault();
                this.searchInput.focus();
            } else if (e.key === '?') {
                // Show shortcuts modal if you have one
                alert('Keyboard Shortcuts:\nN: New Task\nP: New Project\n/: Search\n?: Show Shortcuts');
            }
        });

            this.render();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterTodos(searchTerm);
        });

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
            } else if (e.target.classList.contains('add-subtask') || e.target.closest('.add-subtask')) {
                this.addSubtask(todoId);
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
                ? `/api/todos?projectId=${this.currentProjectId}&parentId=null`
                : '/api/todos?parentId=null';
            const response = await fetch(url);
            this.todos = await response.json();

            // Fetch subtasks for each todo
            for (const todo of this.todos) {
                todo.subtasks = await this.fetchSubtasks(todo.id);
            }

            this.render();
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    async fetchSubtasks(parentId) {
        try {
            const response = await fetch(`/api/todos?parentId=${parentId}`);
            const subtasks = await response.json();

            // Recursively fetch subtasks
            for (const subtask of subtasks) {
                subtask.subtasks = await this.fetchSubtasks(subtask.id);
            }

            return subtasks;
        } catch (error) {
            console.error('Error fetching subtasks:', error);
            return [];
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
        const countTodos = (todos) => {
            let count = todos.filter(todo => !todo.completed).length;
            for (const todo of todos) {
                if (todo.subtasks) {
                    count += countTodos(todo.subtasks);
                }
            }
            return count;
        };

        const remainingTasks = countTodos(this.todos);
        this.tasksCount.textContent = `${remainingTasks} item${remainingTasks !== 1 ? 's' : ''} left`;
    }

    async addTodo(parentId = null) {
        const text = parentId ? prompt('Enter subtask text:') : this.todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    projectId: this.currentProjectId,
                    parentId
                }),
            });
            const newTodo = await response.json();

            if (parentId) {
                const parent = this.findTodo(parentId);
                if (parent) {
                    if (!parent.subtasks) parent.subtasks = [];
                    parent.subtasks.push(newTodo);
                }
            } else {
                newTodo.subtasks = [];
                this.todos.push(newTodo);
                this.todoInput.value = '';
            }

            this.render();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    addSubtask(parentId) {
        this.addTodo(parentId);
    }

    findTodo(id, todos = this.todos) {
        for (const todo of todos) {
            if (todo.id === parseInt(id)) return todo;
            if (todo.subtasks) {
                const found = this.findTodo(id, todo.subtasks);
                if (found) return found;
            }
        }
        return null;
    }

    async deleteTodo(id) {
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            const removeTodo = (todos, id) => {
                const index = todos.findIndex(t => t.id === parseInt(id));
                if (index !== -1) {
                    todos.splice(index, 1);
                    return true;
                }
                for (const todo of todos) {
                    if (todo.subtasks && removeTodo(todo.subtasks, id)) {
                        return true;
                    }
                }
                return false;
            };

            removeTodo(this.todos, id);
            this.render();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    async toggleTodo(id) {
        const todo = this.findTodo(id);
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
                        projectId: todo.projectId,
                        parentId: todo.parentId
                    }),
                });
                const updatedTodo = await response.json();
                Object.assign(todo, updatedTodo);
                this.render();
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
    }

    editTodo(id) {
        const todo = this.findTodo(id);
        if (!todo) return;

        const li = this.todoList.querySelector(`li[data-id="${id}"]`);
        const taskText = li.querySelector('.task-text');

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
                            projectId: todo.projectId,
                            parentId: todo.parentId
                        }),
                    });
                    const updatedTodo = await response.json();
                    Object.assign(todo, updatedTodo);
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
        const findCompletedTodos = (todos) => {
            let completed = [];
            for (const todo of todos) {
                if (todo.completed) {
                    completed.push(todo.id);
                }
                if (todo.subtasks) {
                    completed = completed.concat(findCompletedTodos(todo.subtasks));
                }
            }
            return completed;
        };

        const completedTodoIds = findCompletedTodos(this.todos);

        try {
            await Promise.all(
                completedTodoIds.map(id =>
                    fetch(`/api/todos/${id}`, { method: 'DELETE' })
                )
            );
            await this.fetchTodos(); // Refresh the entire list
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    }

    renderTodo(todo, container) {
        const clone = this.taskTemplate.content.cloneNode(true);
        const li = clone.querySelector('li');
        const checkbox = clone.querySelector('.task-check');
        const taskText = clone.querySelector('.task-text');
        const subtasksList = clone.querySelector('.subtasks');

        li.dataset.id = todo.id;
        checkbox.checked = todo.completed;
        taskText.textContent = todo.text;

        if (todo.completed) {
            taskText.classList.add('completed');
        }

        if (todo.subtasks && todo.subtasks.length > 0) {
            todo.subtasks.forEach(subtask => {
                this.renderTodo(subtask, subtasksList);
            });
        }

        container.appendChild(clone);
    }

    filterTodos(searchTerm) {
        const filtered = this.todos.filter(todo => 
            todo.text.toLowerCase().includes(searchTerm));
        this.render(filtered);
    }

    render(todosToRender = this.todos) {
        this.todoList.innerHTML = '';
        this.todoList.className = `list-group list-group-flush ${this.currentView}-view`;
        
        todosToRender.forEach(todo => {
            this.renderTodo(todo, this.todoList);
        });
        this.updateTasksCount();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});