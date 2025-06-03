const todoInput = document.querySelector(".todo-input");
const todoDatetime = document.querySelector(".todo-datetime");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const progressCount = document.getElementById("progress-count");
const totalCount = document.getElementById("total-count");
const progressBar = document.getElementById("progress-bar");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value.trim() === "") return;

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    
    // Hiển thị text + ngày giờ, định dạng lại ngày giờ
    const dt = todoDatetime.value ? new Date(todoDatetime.value).toLocaleString() : "Chưa đặt thời gian";
    newTodo.innerText = `${todoInput.value} (${dt})`;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    saveLocalTodos({
        text: todoInput.value,
        datetime: todoDatetime.value,
        completed: false,
    });

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);

    todoInput.value = "";
    todoDatetime.value = "";

    updateProgress();
}

function deleteCheck(e) {
    const item = e.target;

    if (item.classList.contains("trash-btn")) {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function () {
        todo.remove();
        updateProgress();
        });
    }

    if (item.classList.contains("complete-btn")) {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        updateCompletedStatus(todo);
        updateProgress();
    }
    }

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        if (todo.nodeType === 1) { // chỉ node element
        switch (e.target.value) {
            case "all":
            todo.style.display = "flex";
            break;
            case "completed":
            todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
            break;
            case "incomplete":
            todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
            break;
        }
        }
    });
    }

function saveLocalTodos(todo) {
    let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    }

function getLocalTodos() {
    let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];

    todos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        if (todo.completed) todoDiv.classList.add("completed");

        const newTodo = document.createElement("li");
        const dt = todo.datetime ? new Date(todo.datetime).toLocaleString() : "Chưa đặt thời gian";
        newTodo.innerText = `${todo.text} (${dt})`;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });

updateProgress();
}

function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    if (!todos) return;

    const todoText = todo.querySelector("li").innerText;
    
    // Vì trong text có định dạng " (datetime)" nên tìm index phù hợp bằng startsWith
    const index = todos.findIndex(t => {
        const dt = t.datetime ? new Date(t.datetime).toLocaleString() : "Chưa đặt thời gian";
        return `${t.text} (${dt})` === todoText;
    });
    if (index !== -1) {
        todos.splice(index, 1);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateCompletedStatus(todo) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    if (!todos) return;

    const todoText = todo.querySelector("li").innerText;
    const index = todos.findIndex(t => {
        const dt = t.datetime ? new Date(t.datetime).toLocaleString() : "Chưa đặt thời gian";
        return `${t.text} (${dt})` === todoText;
    });
    if (index !== -1) {
        todos[index].completed = todo.classList.contains("completed");
        localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function updateProgress() {
    const todos = document.querySelectorAll(".todo");
    const completed = document.querySelectorAll(".todo.completed");

    const total = todos.length;
    const done = completed.length;

    progressCount.textContent = done;
    totalCount.textContent = total;

    const percent = total === 0 ? 0 : (done / total) * 100;
    progressBar.style.width = `${percent}%`;
}
