// import { compareAsc, format } from '../node_modules/date-fns';
import { ToDoRecord } from '../src/ToDoRecord.js';
import { ProjectRecord } from '../src/ProjectRecord.js';
import { projects, showNewTaskContainer, addItemToChecklist, saveToLocalStorage } from '../src/index.js';

export function createToDo(todo, project) {
    if (!(todo instanceof ToDoRecord && project instanceof ProjectRecord)) { return; }
    const wrapper = document.getElementById('taskViews');
    const div = document.createElement('div');
    div.id = 'task-' + todo.id;
    div.classList.add('card', 'taskView', 'mr-4', 'mb-4');

    let priorityColor = "bg-success";
    if (todo.priority === "medium") { priorityColor = "bg-warning"; }
    else if (todo.priority === "high") { priorityColor = "bg-danger"; }

    const header = document.createElement('div');
    header.classList.add('card-header', priorityColor);

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('row');

    const completedBadge = document.createElement('span');
    completedBadge.innerHTML = 'COMPLETED';
    completedBadge.classList.add('badge', 'badge-secondary', todo.completed ? 'completedBadge' : 'unCompletedBadge');
    completedBadge.onclick = () => onBadgeClick(todo, completedBadge);
    headerContainer.appendChild(completedBadge);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('row');

    const editButton = document.createElement('button');
    editButton.classList.add('cardHeaderBtn', 'editBtn', 'mr-3');
    editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
    `;
    editButton.onclick = () => onEditTaskClicked(todo, project, wrapper, div);
    buttonContainer.appendChild(editButton);


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('cardHeaderBtn', 'mr-1');
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    `;
    deleteButton.onclick = () => onDeleteTaskClicked(todo, project, wrapper, div);
    buttonContainer.appendChild(deleteButton);
    headerContainer.appendChild(buttonContainer);


    header.appendChild(headerContainer);
    div.appendChild(header);
    const d = todo.dueDate;
    let datestring = null;
    if (d) {
        datestring = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
    }
    const d2 = todo.createdDate;
    const created = d2.getDate()  + "/" + (d2.getMonth()+1) + "/" + d2.getFullYear() + " " + d2.getHours() + ":" + d2.getMinutes();;
    const body = document.createElement('div');
    body.classList.add('card-body');
    body.innerHTML = `
        <h5 class="card-title mb-1">${todo.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted created">${created}</h6>
        <p class="card-text">${todo.description ? todo.description : '-'}</p>
        <h6 class="card-subtitle mb-2 text-muted notes">${todo.notes ? todo.notes : '-'}</h6>
        ${ datestring ? '<p class="mb-2 mt-5">Due Date:</p>' : '' }
        ${ datestring ? '<h6 class="card-subtitle mb-2 text-muted notes">' + datestring + '</h6>' : '' }
    `;
    if (todo.checklist && todo.checklist.length > 0) {
        /*
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="true or false" id="check-123">
                <label class="form-check-label" for="check-123">
                    checklist item 1
                </label>
            </div>
        */
        todo.checklist.forEach((check, index) => {
            const checkDiv = document.createElement('div');
            checkDiv.classList.add('form-check', 'mb-2');
            // if (todo.checklist.length === index) {
            //     checkDiv.classList
            // }
            const checkInput = document.createElement('input');
            checkInput.id = `check-${check.id}`;
            checkInput.type = 'checkbox';
            checkInput.checked = check.checked;
            checkInput.classList.add('form-check-input');
            checkInput.onchange = () => changeCheckListCheck(check, checkInput);
            const checkLabel = document.createElement('label');
            checkLabel.classList.add('form-check-label');
            checkLabel.innerHTML = check.title;
            checkLabel.setAttribute('for', `check-${check.id}`);
            checkDiv.appendChild(checkInput);
            checkDiv.appendChild(checkLabel);
            body.appendChild(checkDiv);
        });
    }

    div.appendChild(body);
    wrapper.prepend(div);
    updateProjectTasksLength(project);
}

function updateProjectTasksLength(project) {
    const tasksText = project.toDoList.length > 0 ? ('Contains: ' + project.toDoList.length + ' tasks') : 'no tasks yet';
    document.getElementById(`tasksText-${project.id}`).innerHTML = tasksText;
}

function onEditTaskClicked(todo) {
    document.forms['addTaskForm']['todoID'].value = todo.id;
    document.forms['addTaskForm']['title'].value = todo.title;
    document.forms['addTaskForm']['description'].value = todo.description;
    document.forms['addTaskForm']['dueDate'].value = todo.dueDate?.toISOString().substring(0,10);
    document.forms['addTaskForm'][todo.priority].checked = true;
    document.forms['addTaskForm']['notes'].value = todo.notes;
    todo.checklist?.forEach(item => {
        addItemToChecklist(item);
    });
    showNewTaskContainer(true);
}

function onDeleteTaskClicked(todo, project, parentElement, childElement) {
    parentElement.removeChild(childElement);
    project.removeFromList(todo);
    updateProjectTasksLength(project);
    saveToLocalStorage();
}

function changeCheckListCheck(check, checkbox) {
    check.checked = !check.checked;
    checkbox.checked = check.checked;
    saveToLocalStorage();
}

function onBadgeClick(todo, badgeElement) {
    if (todo.completed) {
        todo.completed = null;
        badgeElement.classList.replace('completedBadge', 'unCompletedBadge');
        saveToLocalStorage();
        return;
    }
    todo.completed = new Date();
    badgeElement.classList.replace('unCompletedBadge', 'completedBadge');
    saveToLocalStorage();
}
