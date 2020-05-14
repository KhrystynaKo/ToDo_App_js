class Todo {
  constructor(id, text, completed) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}
class TodoList {
  constructor() {
    this.todos = [];
    this.render(this.todos);
  }

  render(todosArr) {
    this.createTodo(todosArr);
  }

  createTodo(todosArr) {
    console.log(todosArr);
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
    }
  }
}

const todo = new TodoList();

const enterTodo = document.querySelector(".new-todo");
const todoList = document.querySelector(".todo-list");

enterTodo.addEventListener("keydown", (e) => todo.addTodo(e));
todoList.addEventListener("click", (e) => todo.deleteTodo(e));
todoList.addEventListener("click", (e) => todo.markComplete(e));
