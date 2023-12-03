const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", toggleTheme);
let isDarkTheme = localStorage.getItem("darkMode")
  ? JSON.parse(localStorage.getItem("darkMode"))
  : false;
setIcons(isDarkTheme);
setTheme(isDarkTheme);

function toggleTheme(event) {
  event.preventDefault();
  isDarkTheme = !isDarkTheme;
  localStorage.setItem("darkMode", JSON.stringify(isDarkTheme));
  setIcons(isDarkTheme);
  setTheme(isDarkTheme);
}
function setIcons(isDarkTheme) {
  if (isDarkTheme) {
    toggleButton.innerHTML = '<i class="fa-regular fa-sun"></i>';
    return;
  }
  toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
}
function setTheme(isDarkTheme) {
  if (isDarkTheme) {
    document.body.classList.toggle("darkMode");
    return;
  }
  document.body.classList.remove("darkMode");
}
// Task Lists
const pendingList = localStorage.getItem("pendingTask")
  ? JSON.parse(localStorage.getItem("pendingTask"))
  : [];
const completedList = localStorage.getItem("completedTask")
  ? JSON.parse(localStorage.getItem("completedTask"))
  : [];
// DOM Elements

const eraseButton = document.getElementById("eraseButton");
const addItemButton = document.getElementById("addItemButton");
const taskNameInput = document.getElementById("taskName");
const taskDescriptionInput = document.getElementById("taskDescription");
const pendingListContainer = document.getElementById("pendingListContainer");
const completedListContainer = document.getElementById(
  "completedListContainer"
);

eraseButton.addEventListener("click", erase);
addItemButton.addEventListener("click", addToDoItem);

displayItem();

// Collect User Input
function collectData() {
  const taskName = taskNameInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();

  if (taskName) {
    const task = {
      taskName,
      taskDescription,
    };

    taskNameInput.value = "";
    taskDescriptionInput.value = "";

    pendingList.push(task);
    localStorage.setItem("pendingTask", JSON.stringify(pendingList));
  }
}

// Display Task Lists
function displayItem() {
  // Use a document fragment for efficient DOM manipulation
  const fragment = document.createDocumentFragment();
  //rendering pendingList
  pendingList.forEach((task) => {
    task.button = createTaskButtons(task);
    const listItem = document.createElement("li");
    const taskElement = document.createElement("div");
    const heading = document.createElement("h1");
    const details = document.createElement("h3");
    heading.innerHTML = `${task.taskName}<br>`;
    details.innerHTML = `${task.taskDescription}<br>`;
    taskElement.appendChild(heading);
    taskElement.appendChild(details);
    taskElement.appendChild(task.button.editButton);
    taskElement.appendChild(task.button.markCompleteButton);
    taskElement.appendChild(task.button.deleteButton);
    listItem.appendChild(taskElement);

    fragment.appendChild(listItem);
  });

  // Clear the container before appending the new content
  pendingListContainer.innerHTML = "";

  // Append the fragment to the container
  pendingListContainer.appendChild(fragment);

  // rendering completedList
  completedList.forEach((task) => {
    const reDoButton = createButton('<i class="fa-solid fa-rotate"></i>');
    reDoButton.addEventListener("click", () => reDoTask(task));
    const deleteButton = createButton('<i class="fa-solid fa-trash-can"></i>');
    deleteButton.addEventListener("click", () =>
      deleteTask(task, completedList)
    );

    const listItem = document.createElement("li");
    const taskElement = document.createElement("div");
    const heading = document.createElement("h1");
    const details = document.createElement("h3");
    heading.innerHTML = `${task.taskName}<br>`;
    details.innerHTML = `${task.taskDescription}<br>`;
    taskElement.appendChild(heading);
    taskElement.appendChild(details);

    taskElement.appendChild(reDoButton);
    taskElement.appendChild(deleteButton);

    listItem.appendChild(taskElement);
    fragment.appendChild(listItem);
  });

  // Clear the container before appending the new content
  completedListContainer.innerHTML = "";

  // Append the fragment to the container
  completedListContainer.appendChild(fragment);
}

function addToDoItem(event) {
  if (taskNameInput.value.trim()) {
    event.preventDefault();
  }
  collectData();
  displayItem();
}

function markComplete(task) {
  completedList.push(task);
  const index = pendingList.indexOf(task);
  pendingList.splice(index, 1);
  localStorage.setItem("pendingTask", JSON.stringify(pendingList));
  localStorage.setItem("completedTask", JSON.stringify(completedList));

  displayItem();
}
function reDoTask(task) {
  pendingList.push(task);
  const index = completedList.indexOf(task);
  completedList.splice(index, 1);
  localStorage.setItem("pendingTask", JSON.stringify(pendingList));
  localStorage.setItem("completedTask", JSON.stringify(completedList));
  displayItem();
}
function deleteTask(task, taskList) {
  const index = taskList.indexOf(task);
  taskList.splice(index, 1);
  localStorage.setItem("pendingTask", JSON.stringify(pendingList));
  localStorage.setItem("completedTask", JSON.stringify(completedList));
  displayItem();
}

function erase(event) {
  event.preventDefault();
  taskNameInput.value = "";
  taskDescriptionInput.value = "";
}

function editTask(task) {
  taskNameInput.value = task.taskName;
  taskDescriptionInput.value = task.taskDescription;
  const updateButton = createButton('Update <i class="fa-solid fa-check"></i>');
  updateButton.addEventListener("click", (event) =>
    updateTask(event, task, updateButton)
  );
  addItemButton.replaceWith(updateButton);
  task.button.editButton.disabled = true;
  task.button.markCompleteButton.disabled = true;
  task.button.deleteButton.disabled = true;
}
function updateTask(event, task, updateButton) {
  event.preventDefault();
  deleteTask(task, pendingList);
  collectData();
  displayItem();
  updateButton.replaceWith(addItemButton);
}

function createButton(htmlContent) {
  const button = document.createElement("button");
  button.innerHTML = htmlContent;
  return button;
}

function createTaskButtons(task) {
  const editButton = createButton('<i class="fa-solid fa-pencil"></i>');
  editButton.addEventListener("click", () => editTask(task));

  const markCompleteButton = createButton('<i class="fa-solid fa-check"></i>');
  markCompleteButton.addEventListener("click", () => markComplete(task));

  const deleteButton = createButton('<i class="fa-solid fa-trash-can"></i>');
  deleteButton.addEventListener("click", () => deleteTask(task, pendingList));

  return { editButton, markCompleteButton, deleteButton };
}
