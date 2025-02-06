class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.tasksCount = document.getElementById('tasks-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.taskTemplate = document.getElementById('task-template');

        this.bindEvents();
        this.render();
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

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.updateTasksCount();
    }

    updateTasksCount() {
        const remainingTasks = this.todos.filter(todo => !todo.completed).length;
        this.tasksCount.textContent = `${remainingTasks} item${remainingTasks !== 1 ? 's' : ''} left`;
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now().toString(),
            text,
            completed: false
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    editTodo(id) {
        const li = this.todoList.querySelector(`li[data-id="${id}"]`);
        const taskText = li.querySelector('.task-text');
        const todo = this.todos.find(todo => todo.id === id);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'task-edit-input';
        
        taskText.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) {
                todo.text = newText;
                this.saveTodos();
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

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
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
