class TodoApp {
    constructor() {
        this.todos = [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.tasksCount = document.getElementById('tasks-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.taskTemplate = document.getElementById('task-template');

        this.bindEvents();
        this.fetchTodos();
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
    }

    async fetchTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.render();
        } catch (error) {
            console.error('Error fetching todos:', error);
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
                body: JSON.stringify({ text }),
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