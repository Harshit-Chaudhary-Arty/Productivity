// ===== GLOBAL VARIABLES =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedType = "Select Type";
let selectedColor = "#a0a0a0";
let selectedImage = null;


// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', function() {
    setupDate();
    displayTasks();
    setupEventListeners();
});


// ===== DATE FUNCTIONS =====
function setupDate() {
    const today = new Date();
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
                   "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]; //index 0-11 for months
    
    document.getElementById('date').textContent = today.getDate();
    document.getElementById('month').textContent = months[today.getMonth()];
}


// ALL EVENT LISTENERS FUNCTION
// This function sets up all the event listeners for the app
function setupEventListeners() {
    // Form submission
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault(); //prevents default refreshing the page
        addNewTask();
    });
    
    // Image upload
    document.getElementById('imageInput').addEventListener('change', function(e) {
        const file = e.target.files[0]; // Get the first file from the multiple input
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                selectedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Task type dropdown
    setupDropdown();
    
    // Modal close events
    setupModal();
}


// DROPDOWN FUNCTIONALITY
function setupDropdown() {
    const dropdown = document.querySelector('.typesDropdown');
    const label = document.querySelector('.typesLabel');
    
    // Open/close dropdown
    label.addEventListener('click', function() {
        dropdown.classList.toggle('show');
    });
    
    // Handle type selection
    // Loops through all options and adds click event listeners
    document.querySelectorAll('.types').forEach(function(typeOption) {
        typeOption.addEventListener('click', function() {
            const typeName = this.textContent.trim();
            const typeColor = window.getComputedStyle(this.querySelector('.accentBox')).backgroundColor;
            
            // Update UI on selection
            document.querySelector('.labelText').textContent = typeName;
            document.getElementById('selectedAccent').style.backgroundColor = typeColor;
            
            // Save selection globally
            selectedType = typeName;
            selectedColor = typeColor;
            
            // Close dropdown
            dropdown.classList.remove('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!label.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}


// ADD NEW TASK
function addNewTask() {
    const taskText = document.getElementById('input-task').value.trim();
    
    if (taskText === "") return;
    
    // Create new task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        type: selectedType,
        color: selectedColor,
        image: selectedImage,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save and refresh
    saveTasks();
    displayTasks();
    resetForm();
}


// RESET FORM
function resetForm() {
    document.getElementById('input-task').value = "";
    document.getElementById('imageInput').value = "";
    selectedImage = null;
    selectedType = "Select Type";
    selectedColor = "#a0a0a0";
    
    document.querySelector('.labelText').textContent = "Select Type";
    document.getElementById('selectedAccent').style.backgroundColor = "#a0a0a0";
}

// DISPLAY ALL TASKS
function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";
    
    tasks.forEach(function(task, index) {
        const taskHTML = createTaskHTML(task, index); //creates HTML element for each task
        taskList.appendChild(taskHTML); // adds the task HTML to the task list
    });
}

// CREATE SINGLE TASK HTML
function createTaskHTML(task, index) {
    const li = document.createElement("li");
    li.className = "task";
    
    let imageHTML = "";
    if (task.image) {
        imageHTML = `<img src="${task.image}" class="task-image" onclick="openModal('${task.image}')" alt="Task image">`;
    }
    
    li.innerHTML = `
        <div class="task-type-indicator" style="background-color: ${task.color}"></div>
        <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${index})">
        <label class="custom-checkbox" for="task-${index}">
            <svg fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <div class="task-content">
            <label for="task-${index}" class="task-text">${task.text}</label>
            <div class="task-meta">
                <span class="task-type-badge" style="background-color: ${task.color}">${task.type}</span>
            </div>
            ${imageHTML}
        </div>
        <button class="delete-button" onclick="deleteTask(${index})">
            <svg fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;
    
    return li;
}

// TASK ACTIONS
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// STORAGE FUNCTIONS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// MODAL(image popup) FUNCTION
function setupModal() {
    const modal = document.getElementById('imageModal');
    
    // Close modal when clicking background
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden'; // prevents scrolling when modal is open
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('modalImage').src = '';
    }, 300);
    document.body.style.overflow = 'auto'; // allows scrolling again
}