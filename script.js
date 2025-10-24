// Get references to DOM elements
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");
const clearAllButton = document.getElementById("clear-all-button");

// Local storage key
const STORAGE_KEY = "todoListItems";

// Function to save todos to local storage
function saveTodosToStorage() {
  const todos = [];
  const listItems = todoList.querySelectorAll("li");

  listItems.forEach((item) => {
    const deleteButton = item.querySelector(".delete-btn");
    const text = item.textContent.replace("Delete", "").trim();
    const isCompleted = item.classList.contains("completed");

    todos.push({
      text: text,
      completed: isCompleted,
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Function to toggle Clear All button visibility
function toggleClearAllButton() {
  const listItems = todoList.querySelectorAll("li");
  if (listItems.length > 0) {
    clearAllButton.style.display = "block";
  } else {
    clearAllButton.style.display = "none";
  }
}

// Function to clear all todo items
function clearAllTodos() {
  // Show confirmation dialog
  const confirmed = confirm(
    "Are you sure you want to delete all to-do items? This action cannot be undone."
  );

  if (confirmed) {
    // Remove all list items
    todoList.innerHTML = "";

    // Save empty list to storage
    saveTodosToStorage();

    // Hide the Clear All button
    toggleClearAllButton();
  }
}

// Function to load todos from local storage
function loadTodosFromStorage() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach((todo) => {
      createTodoItem(todo.text, todo.completed);
    });
  }
}

// Function to create a todo item (extracted for reuse)
function createTodoItem(todoText, isCompleted = false) {
  // Create new list item
  const listItem = document.createElement("li");
  listItem.textContent = todoText;

  // Add completed class if needed
  if (isCompleted) {
    listItem.classList.add("completed");
  }

  // Add click event to mark as completed
  listItem.addEventListener("click", function () {
    listItem.classList.toggle("completed");
    saveTodosToStorage(); // Save to storage when completed status changes
  });

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent triggering the completed toggle
    todoList.removeChild(listItem);
    saveTodosToStorage(); // Save to storage when item is deleted
    toggleClearAllButton(); // Update Clear All button visibility
  });

  // Append delete button to list item
  listItem.appendChild(deleteButton);

  // Add the new item to the list
  todoList.appendChild(listItem);

  // Update Clear All button visibility
  toggleClearAllButton();
}

// Function to add a new to-do item
function addTodoItem() {
  const todoText = todoInput.value.trim();

  // Check if input is not empty
  if (todoText === "") {
    alert("Please enter a to-do item!");
    return;
  }

  // Create the todo item
  createTodoItem(todoText);

  // Save to storage
  saveTodosToStorage();

  // Clear the input field
  todoInput.value = "";
}

// Add event listener to the Add button
addButton.addEventListener("click", addTodoItem);

// Add event listener to the Clear All button
clearAllButton.addEventListener("click", clearAllTodos);

// Add event listener for Enter key press in input field
todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodoItem();
  }
});

// Initialize the app when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load saved todos from storage
  loadTodosFromStorage();

  // Update Clear All button visibility
  toggleClearAllButton();

  // Focus on input field when page loads
  todoInput.focus();
});
