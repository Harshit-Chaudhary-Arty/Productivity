// ====== FIREBASE CONFIG ======
const firebaseConfig = {
  apiKey: "AIzaSyBcIdKhEBn_1qPNzqE4BLSYSpMTqgnRDD0",
  authDomain: "productivity-a1aba.firebaseapp.com",
  databaseURL: "https://productivity-a1aba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "productivity-a1aba",
  storageBucket: "productivity-a1aba.firebasestorage.app",
  messagingSenderId: "251917225855",
  appId: "1:251917225855:web:12a80cc47b6525156e144a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== GLOBAL VARIABLES =====
let tasks = [];
let selectedType = "Select Type";
let selectedColor = "#a0a0a0";
let selectedCourse = "Select Course";
let selectedCourseColor = "#a0a0a0";
let selectedImage = null;
let selectedLink = null;
let localExpansionState = {};  // 🔥 NEW

// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', function () {
  setupDate();
  displayTasks();
  setupEventListeners();
});

// ===== DATE FUNCTIONS =====
function setupDate() {
  const today = new Date();
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  document.getElementById('date').textContent = today.getDate();
  document.getElementById('month').textContent = months[today.getMonth()];
}

// ===== DISPLAY TASKS FROM FIREBASE =====
function displayTasks() {
  db.ref("tasks").on("value", snapshot => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";
    tasks = [];

    snapshot.forEach(child => {
      const task = child.val();
      tasks.push(task);
    });

    renderTasks();
  });
}

// ===== RENDER ALL TASKS =====
function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskHTML = createTaskHTML(task, index);
    taskList.appendChild(taskHTML);
  });
}

// ===== ADD TASK TO FIREBASE =====
function addNewTask() {
  const taskText = document.getElementById('input-task').value.trim();
  if (taskText === "") {
    openAlertModal();
    return;
  }


  const newTask = {
    id: Date.now(),
    text: taskText,
    type: selectedType,
    color: selectedColor,
    course: selectedCourse,
    courseColor: selectedCourseColor,
    image: selectedImage,
    link: selectedLink,
    completed: false
    // ❌ No "expanded"
  };

  db.ref("tasks/" + newTask.id).set(newTask);
  resetForm();



  //   if (taskText === "") {
  //   alert("⚠️ Please enter a task description.");
  //   return;
  // }
}

// ===== TOGGLE COMPLETED =====
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  db.ref("tasks/" + tasks[index].id).update({ completed: tasks[index].completed });
}

// ===== DELETE TASK =====
function deleteTask(index) {
  const taskId = tasks[index].id;
  db.ref("tasks/" + taskId).remove();
}

// ===== RESET FORM =====
function resetForm() {
  document.getElementById('input-task').value = "";
  document.getElementById('imageInput').value = "";
  selectedImage = null;
  selectedLink = null;
  selectedType = "Select Type";
  selectedColor = "#a0a0a0";
  selectedCourse = "Select Course";
  selectedCourseColor = "#a0a0a0";

  document.querySelector('.labelText').textContent = "Select Type";
  document.getElementById('selectedAccent').style.backgroundColor = "#a0a0a0";
  document.querySelector('.courseLabelText').textContent = "Select Course";
  document.getElementById('selectedCourseAccent').style.backgroundColor = "#a0a0a0";
}

// ===== CREATE SINGLE TASK HTML =====
function createTaskHTML(task, index) {
  const li = document.createElement("li");
  li.className = "task";

  const taskHeader = document.createElement("div");
  taskHeader.className = "task-header";
  taskHeader.onclick = () => toggleTaskExpansion(index);

  let typeBadgeHTML = "";
  if (task.type && task.type !== "Select Type") {
    typeBadgeHTML = `<div class="task-type-badge" style="background-color: ${task.color}">${task.type}</div>`;
  }

  const courseName = task.course && task.course !== "Select Course" ? task.course : "No Course";
  const isExpanded = localExpansionState[task.id] || false;
  const arrowClass = isExpanded ? "expanded" : "";

  taskHeader.innerHTML = `
    ${typeBadgeHTML}
    <div class="task-course-name">${courseName}</div>
    <svg class="task-dropdown-arrow ${arrowClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
    </svg>
  `;

  const taskContent = document.createElement("div");
  taskContent.className = `task-content ${isExpanded ? 'expanded' : ''}`;

  let imageHTML = "";
  if (task.image) {
    imageHTML = `<img src="${task.image}" class="task-image" onclick="openModal('${task.image}')" alt="Task image">`;
  }

  let linkHTML = "";
  if (task.link) {
    linkHTML = `<a href="${task.link}" target="_blank" class="task-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"></path></svg>
            Link
        </a>`;
  }

  taskContent.innerHTML = `
    <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
    <div class="task-details">
      <div class="task-text">${task.text}</div>
      <div class="task-meta">${linkHTML}${imageHTML}</div>
    </div>
    <div class="task-actions">
      <div class="task-left-actions">
        <label class="custom-checkbox" for="task-${index}">
          <svg fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
          </svg>
        </label>
      </div>
      <button class="delete-button" onclick="deleteTask(${index})">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    </div>
  `;

  li.appendChild(taskHeader);
  li.appendChild(taskContent);
  return li;
}

// ===== TOGGLE EXPANSION =====
function toggleTaskExpansion(index) {
  const taskId = tasks[index].id;
  localExpansionState[taskId] = !localExpansionState[taskId];
  renderTasks();
}

// ===== MODALS =====
function setupModal() {
  const modal = document.getElementById('imageModal');
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSrc;
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.getElementById('modalImage').src = '';
  }, 300);
  document.body.style.overflow = 'auto';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    addNewTask();
  });

  document.getElementById('imageInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => selectedImage = e.target.result;
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('addLink-button').addEventListener('click', openLinkModal);
  setupDropdown();
  setupCourseDropdown();
  setupModal();
}

// ===== LINK MODAL =====
function openLinkModal() {
  const modal = document.getElementById('linkModal');
  modal.style.display = 'flex';
  document.getElementById('linkInput').focus();
  document.body.style.overflow = 'hidden';
}

function closeLinkModal() {
  const modal = document.getElementById('linkModal');
  modal.style.display = 'none';
  document.getElementById('linkInput').value = '';
  document.body.style.overflow = 'auto';
}

function confirmLink() {
  const url = document.getElementById('linkInput').value.trim();
  if (url) {
    try {
      new URL(url);
      selectedLink = url;
      closeLinkModal();
    } catch {
      alert("Please enter a valid URL.");
    }
  }
}

// ===== DROPDOWN SETUP =====
function setupDropdown() {
  const dropdown = document.querySelector('.typesDropdown');
  const label = document.querySelector('.typesLabel');

  label.addEventListener('click', () => {
    dropdown.classList.toggle('show');
    document.querySelector('.courseDropdown').classList.remove('show');
  });

  document.querySelectorAll('.types').forEach(type => {
    type.addEventListener('click', function () {
      const name = this.textContent.trim();
      const color = window.getComputedStyle(this.querySelector('.accentBox')).backgroundColor;
      selectedType = name;
      selectedColor = color;
      document.querySelector('.labelText').textContent = name;
      document.getElementById('selectedAccent').style.backgroundColor = color;
      dropdown.classList.remove('show');
    });
  });

  document.addEventListener('click', e => {
    if (!label.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function setupCourseDropdown() {
  const dropdown = document.querySelector('.courseDropdown');
  const label = document.querySelector('.courseLabel');

  label.addEventListener('click', () => {
    dropdown.classList.toggle('show');
    document.querySelector('.typesDropdown').classList.remove('show');
  });

  document.querySelectorAll('.courses').forEach(course => {
    course.addEventListener('click', function () {
      const name = this.textContent.trim();
      const color = window.getComputedStyle(this.querySelector('.accentBox')).backgroundColor;
      selectedCourse = name;
      selectedCourseColor = color;
      document.querySelector('.courseLabelText').textContent = name;
      document.getElementById('selectedCourseAccent').style.backgroundColor = color;
      dropdown.classList.remove('show');
    });
  });

  document.addEventListener('click', e => {
    if (!label.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function openAlertModal() {
  const modal = document.getElementById('alertModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAlertModal() {
  const modal = document.getElementById('alertModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}