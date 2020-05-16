class Todo {
  constructor(id, text, completed) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}
class TodoList {
  constructor() {
    this.todos = JSON.parse(window.localStorage.getItem("todos")) || [];
    this.completed = [];
    this.active = [];
    this.render(this.todos);
  }

  render(todosArr) {
    this.createTodo(todosArr);
    this.countTodo();
  }

  createTodo(todosArr) {
    const todoList = document.querySelector(".todo-list");
    todoList.innerHTML = "";
    todosArr.forEach((todo) => {
      const liItem = document.createElement("li");
      liItem.classList.add("li-item");
      liItem.dataset.listId = todo.id;
      todoList.appendChild(liItem);

      const div = document.createElement("div");
      div.className = "view";
      liItem.appendChild(div);

      const input = document.createElement("input");
      input.className = "toggle";
      input.setAttribute("type", "checkbox");
      div.appendChild(input);

      if (todo.completed === true) {
        input.setAttribute("checked", true);
        liItem.classList.add("completed");
      }

      const label = document.createElement("label");
      label.innerHTML = todo.text;
      div.appendChild(label);

      const deleteButton = document.createElement("button");
      deleteButton.className = "destroy";
      div.appendChild(deleteButton);
    });
  }

  addTodo(e) {
    const enterTodo = document.querySelector(".new-todo");

    if (e.keyCode === 13) {
      const todoListContent = enterTodo.value.trim();
      if (todoListContent == null || todoListContent === "") return;
      else {
        this.todos.push(
          new Todo(Date.now().toString(), todoListContent, false)
        );
        this.saveTodosInLocalStorage();

        enterTodo.value = null;
      }
      this.render(this.todos);
    }
  }

  deleteTodo(e) {
    if (e.target.classList.contains("destroy")) {
      this.todos = this.todos.filter(
        (todo) =>
          todo.id !== e.target.parentElement.parentElement.dataset.listId
      );

      this.render(this.todos);
      this.saveTodosInLocalStorage();
    }
  }

  markComplete(e) {
    if (e.target.type === "checkbox") {
      this.todos = this.todos.map((todo) => {
        if (todo.id === e.target.parentElement.parentElement.dataset.listId) {
          todo.completed = !todo.completed;
        }
        return todo;
      });
      this.render(this.todos);
      this.saveTodosInLocalStorage();
    }
  }

  removeClass(elem, selectorClass) {
    console.log(elem);
    elem.classList.remove(selectorClass);
  }

  addClass(elem, selectorClass) {
    elem.classList.add(selectorClass);
  }

  filteredTodos(e, name, func) {
    e.preventDefault();

    if (e.target.classList.contains(name)) {
      this.addClass(e.target, "selected");
      this.name = func;
      this.render(this.name);
    }
  }

  countTodo() {
    const todoCount = document.querySelector(".todo-count");
    const incompleteTodo = this.todos.filter((todo) => todo.completed === false)
      .length;
    const incompleteTodoCount = incompleteTodo === 1 ? "item" : "items";
    todoCount.innerHTML = `${incompleteTodo} ${incompleteTodoCount} left`;
  }

  saveTodosInLocalStorage() {
    window.localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}

const todo = new TodoList();

const enterTodo = document.querySelector(".new-todo");
const todoList = document.querySelector(".todo-list");

enterTodo.addEventListener("keydown", (e) => todo.addTodo(e));
todoList.addEventListener("click", (e) => todo.deleteTodo(e));
todoList.addEventListener("click", (e) => todo.markComplete(e));

const filters = document.querySelectorAll(".filters > li > a");
filters.forEach((filter) => {
  filter.addEventListener("click", (e) => {
    filters.forEach((filter) => {
      todo.removeClass(filter, "selected");
    });

    todo.filteredTodos(e, "all", todo.todos);
    todo.filteredTodos(
      e,
      "complete",
      todo.todos.filter((todo) => todo.completed === true)
    );
    todo.filteredTodos(
      e,
      "active",
      todo.todos.filter((todo) => todo.completed === false)
    );
  });
});
