const taskForm = document.querySelector('form');
const taskInput = document.getElementById('input-task');
const taskListUL = document.getElementById('task-list');

let allTasks = getTasks();
updateTaskList();


taskForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTask();
})

function addTask(){
    const taskText = taskInput.value.trim();
    if(taskText.length > 0){
        allTasks.push(taskText);
        updateTaskList();
        saveTasks();
        taskInput.value = "";
    }
    
}

function updateTaskList(){
    taskListUL.innerHTML = "";
    allTasks.forEach((task, taskIndex)=>{
        taskItem = createTask(task, taskIndex);
        taskListUL.append(taskItem);
    })
}


function createTask(task, taskIndex){
    const taskId = "task-"+taskIndex;
    const newTaskLI= document.createElement("li");
    newTaskLI.className = "task";
    newTaskLI.innerHTML = `
                <input type="checkbox" id="${taskId}">
                <label class="custom-checkbox" for="${taskId}" >
                    <svg fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                    </svg>
                </label>
                <label for="${taskId}" class="task-text"> 
                    ${task}
                </label>
                <button  class="delete-button"><svg fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>

    `

    const deleteButton = newTaskLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTaskItem(taskIndex);
    })


    return newTaskLI;
}


function deleteTaskItem(taskIndex){
    allTasks = allTasks.filter((_, i)=> i !==taskIndex);
    saveTasks();
    updateTaskList();
}


function saveTasks(){
    const tasksJson = JSON.stringify(allTasks); // converted to strings
    localStorage.setItem("tasks", tasksJson); //ONLY STRINGS CAN BE STORED AND NOT ARRAYS HERE, SO CONVERTED ARRAY ELEMENTS TO STRING

}

function getTasks(){
    const tasks = localStorage.getItem("tasks") || "[]"; //if the local storage is empty then it creates empty array instead of giving null
    return JSON.parse(tasks);
}


//Getting and applying users Date for displaying next dates.


let userDate;
let userDateNextDay;
let userMonth;
let userNextMonth;


function updateDate(){

    //current date
    userDate = new Date().getDate();
    let userMonthIndex = new Date().getMonth();

    let months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];

    userMonth = months [userMonthIndex];

    //date next day
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    userDateNextDay = tomorrow.getDate();

    //next month
    let userNextMonthIndex = tomorrow.getMonth();
    userNextMonth = months[userNextMonthIndex];

}

function displayDate(){

    //Current Day
    let displayDate = document.getElementById('date');
    let displayMonth = document.getElementById('month');
    
    displayDate.textContent = userDate;
    displayMonth.textContent = userMonth;


    //next Dat
    let displayDateNextDay = document.getElementById('dateNextDay');
    let displayNextMonth = document.getElementById('NextMonth');

    displayDateNextDay.textContent = userDateNextDay;
    displayNextMonth.textContent = userNextMonth;

    
}

function typeSelection() {
    const types = document.querySelectorAll('.typesDropdown li');
    const labelWrapper = document.querySelector('.typesLabel');
    const labelText = document.querySelector('.labelText');
    const dropdown = document.querySelector('.typesDropdown');
    const selectedAccent = document.getElementById('selectedAccent');

    labelWrapper.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    types.forEach((type) => {
        type.addEventListener('click', () => {
            const selectedType = type.textContent.trim();
            labelText.textContent = selectedType;

            const accentBox = type.querySelector('.accentBox');
            const color = getComputedStyle(accentBox).backgroundColor;
            selectedAccent.style.backgroundColor = color;

            dropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!labelWrapper.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}
typeSelection();

updateDate();
displayDate();