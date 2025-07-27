// ===== GLOBAL VARIABLES =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedType = "Select Type";
let selectedColor = "#a0a0a0";
let selectedCourse = "Select Course";
let selectedCourseColor = "#a0a0a0";
let selectedImage = null;
let selectedLink = null;

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
    
    // Add Link button
    document.getElementById('addLink-button').addEventListener('click', function() {
        openLinkModal();
    });
    
    // Task type dropdown
    setupDropdown();
    
    // Course dropdown
    setupCourseDropdown();
    
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
        // Close course dropdown if open
        document.querySelector('.courseDropdown').classList.remove('show');
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

// COURSE DROPDOWN FUNCTIONALITY
function setupCourseDropdown() {
    const dropdown = document.querySelector('.courseDropdown');
    const label = document.querySelector('.courseLabel');
    
    // Open/close dropdown
    label.addEventListener('click', function() {
        dropdown.classList.toggle('show');
        // Close type dropdown if open
        document.querySelector('.typesDropdown').classList.remove('show');
    });
    
    // Handle course selection
    document.querySelectorAll('.courses').forEach(function(courseOption) {
        courseOption.addEventListener('click', function() {
            const courseName = this.textContent.trim();
            const courseColor = window.getComputedStyle(this.querySelector('.accentBox')).backgroundColor;
            
            // Update UI on selection
            document.querySelector('.courseLabelText').textContent = courseName;
            document.getElementById('selectedCourseAccent').style.backgroundColor = courseColor;
            
            // Save selection globally
            selectedCourse = courseName;
            selectedCourseColor = courseColor;
            
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

// LINK MODAL FUNCTIONS
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
    const linkInput = document.getElementById('linkInput');
    const url = linkInput.value.trim();
    
    if (url) {
        // Basic URL validation
        try {
            new URL(url);
            selectedLink = url;
            closeLinkModal();
        } catch (error) {
            alert('Please enter a valid URL (e.g., https://example.com)');
        }
    }
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
        course: selectedCourse,
        courseColor: selectedCourseColor,
        image: selectedImage,
        link: selectedLink,
        completed: false,
        expanded: false
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
    
    // Create task header
    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";
    taskHeader.onclick = () => toggleTaskExpansion(index);
    
    // Type badge
    let typeBadgeHTML = "";
    if (task.type && task.type !== "Select Type") {
        typeBadgeHTML = `<div class="task-type-badge" style="background-color: ${task.color}">${task.type}</div>`;
    }
    
    // Course name
    let courseName = task.course && task.course !== "Select Course" ? task.course : "No Course";
    
    // Dropdown arrow
    const arrowClass = task.expanded ? "expanded" : "";
    
    taskHeader.innerHTML = `
        ${typeBadgeHTML}
        <div class="task-course-name">${courseName}</div>
        <svg class="task-dropdown-arrow ${arrowClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
        </svg>
    `;
    
    // Create task content
    const taskContent = document.createElement("div");
    taskContent.className = `task-content ${task.expanded ? 'expanded' : ''}`;
    
    // Task details
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
        <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${index})">
        <div class="task-details">
            <div class="task-text">${task.text}</div>
            <div class="task-meta">
                ${linkHTML}
                ${imageHTML}
            </div>
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
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
        </div>
    `;
    
    li.appendChild(taskHeader);
    li.appendChild(taskContent);
    
    return li;
}

// TOGGLE TASK EXPANSION
function toggleTaskExpansion(index) {
    tasks[index].expanded = !tasks[index].expanded;
    saveTasks();
    displayTasks();
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