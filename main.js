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

  setListeners() {
    this.enterTodo = document.querySelector(".new-todo");
    this.enterTodo.addEventListener("keydown", (e) => this.addTodo(e));
  }

  render(todosArr) {
    this.createTodo(todosArr);
    this.setListeners();
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
    if (e.keyCode === 13) {
      const todoListContent = this.enterTodo.value.trim();
      if (todoListContent == null || todoListContent === "") return;
      else {
        this.todos.push(
          new Todo(Date.now().toString(), todoListContent, false)
        );
        console.log(this.todos);
        console.log(todoListContent);
        this.enterTodo.value = null;
      }
      this.render(this.todos);
    }
  }
}

const todo = new TodoList();
