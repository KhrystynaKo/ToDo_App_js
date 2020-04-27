const enterTodo = document.querySelector(".new-todo");
const todoList = document.querySelector(".todo-list");
const todoCount = document.querySelector(".todo-count");
const footer = document.querySelector(".footer");
const clearTodo = document.querySelector(".clear-completed");
const toggleAll = document.querySelector("#toggle-all");
const toggleLabel = document.querySelector("#toggle-label");

let localStorageListKey = "task.todoListItems";
let localStorageListKeyId = "task.selectedTodoId";
let todoListItems = JSON.parse(localStorage.getItem(localStorageListKey)) || [];
let selectedTodoId = localStorage.getItem(localStorageListKeyId);

footer.classList.add("hidden");
clearTodo.classList.add("hidden");
toggleLabel.classList.add("hidden");

let save = () => {
  localStorage.setItem(localStorageListKey, JSON.stringify(todoListItems));
  localStorage.setItem(localStorageListKeyId, selectedTodoId);
};

let saveAndCreate = () => {
  save();
  createTodo();
};

let createTodo = () => {
  clearList(todoList);
  todoListItems.forEach((todo) => {
    const liItem = document.createElement("li");
    liItem.classList.add("li-item");
    liItem.dataset.listId = todo.todoId;
    todoList.appendChild(liItem);
    const div = document.createElement("div");
    div.className = "view";
    liItem.appendChild(div);
    const input = document.createElement("input");
    input.className = "toggle";
    input.setAttribute("type", "checkbox");
    if (todo.completed === true) {
      input.setAttribute("checked", true);
      liItem.classList.add("completed");
    }
    const label = document.createElement("label");
    label.innerHTML = todo.todoContent;
    const deleteButton = document.createElement("button");
    deleteButton.className = "destroy";
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(deleteButton);
    countTodo();
    footer.classList.remove("hidden");
    const showComplitedButton = todoListItems.filter(
      (todo) => todo.completed === true
    );
    if (showComplitedButton.length >= 1) {
      clearTodo.classList.remove("hidden");
    } else {
      clearTodo.classList.add("hidden");
    }
  });
};

let clearList = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// add todos to array

let addTodo = (str) => {
  return {
    todoId: Date.now().toString(),
    todoContent: str,
    completed: false,
  };
};

//delete todos by delete button

let deleteTodo = (e) => {
  if (e.target.classList.contains("destroy")) {
    let filterTodo = todoListItems.find(
      (todo) =>
        todo.todoId === e.target.parentElement.parentElement.dataset.listId
    );
    todoListItems.splice(todoListItems.indexOf(filterTodo), 1);

    e.target.parentElement.parentElement.remove();
    if (todoListItems.length === 0) {
      footer.classList.add("hidden");
    }
    countTodo();
    saveAndCreate();
  }
};

// check todos

let checkedTodo = (e) => {
  if (e.target.type === "checkbox") {
    let checkbox = e.target;
    todoListItems.forEach((todo) => {
      const itemCompleted = checkbox.parentElement.parentElement;
      itemCompleted.classList.remove("completed");
      selectedTodoId = checkbox.parentElement.parentElement.dataset.listId;
      let selectedList = todoListItems.find(
        (todo) => todo.todoId === selectedTodoId
      );
      selectedList.completed = false;

      if (checkbox.checked === true) {
        itemCompleted.classList.add("completed");
        selectedList.completed = true;
      }
    });

    countTodo();
    saveAndCreate();
  }
};

//set count for active todos

let countTodo = () => {
  const incompleteTodo = todoListItems.filter(
    (todo) => todo.completed === false
  ).length;
  const incompleteTodoCount = incompleteTodo === 1 ? "item" : "items";
  todoCount.innerHTML = `${incompleteTodo} ${incompleteTodoCount} left`;
};

// clear all completed todos

let clearComplete = (e) => {
  for (let i = 0; i < todoListItems.length; i++) {
    if (todoListItems[i].completed === true) {
      todoListItems.splice(i, 1);
      i--;
    }
  }
  if (todoListItems.length < 1) {
    footer.classList.add("hidden");
  }

  saveAndCreate();
};

// filter for active / completed / all todos

let filteredTodos = (e) => {
  e.preventDefault();
  const active = todoListItems.filter((todo) => todo.completed === true);
  const activeId = active.map((todo) => todo.todoId);
  const li = todoList.getElementsByTagName("li");

  //show active todos

  if (e.target.classList.contains("active")) {
    for (let elem of li) {
      elem.classList.remove("hidden");
      let id = elem.dataset.listId;
      for (let item of activeId) {
        if (id === item) {
          elem.classList.add("hidden");
        }
      }
    }

    //show completed todos
  } else if (e.target.classList.contains("complete")) {
    for (let elem of li) {
      elem.classList.add("hidden");
      let id = elem.dataset.listId;
      for (let item of activeId) {
        if (id === item) {
          elem.classList.remove("hidden");
        }
      }
    }

    //show all todos
  } else if (e.target.classList.contains("selected")) {
    for (let elem of li) {
      elem.classList.remove("hidden");
    }
  }
};

enterTodo.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    const todoListContent = enterTodo.value;
    if (todoListContent == null || todoListContent === "") return;
    const todo = addTodo(todoListContent);
    enterTodo.value = null;
    todoListItems.push(todo);
    saveAndCreate();
  }
});

todoList.addEventListener("click", deleteTodo);

todoList.addEventListener("click", checkedTodo);

clearTodo.addEventListener("click", clearComplete);

footer.addEventListener("click", filteredTodos);

saveAndCreate();
