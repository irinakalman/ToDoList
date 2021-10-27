// import { compareAsc, format } from '../node_modules/date-fns';
import { ToDoRecord } from '../src/ToDoRecord.js';
import { ProjectRecord } from '../src/ProjectRecord.js';
import { createToDo } from '../src/createToDo.js';
import { projects, showNewProjectContainer, saveToLocalStorage } from '../src/index.js';

export function createProject (project) {
    if (!(project instanceof ProjectRecord)) { return; }
    const wrapper = document.getElementById('projectViews');
    const div = document.createElement('div');
    div.id = 'project-' + project.id;
    div.classList.add('card', 'projectView', 'mb-4', 'mr-4');
    const header = document.createElement('div');
    header.classList.add('card-header', 'bg-dark');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('row', 'end');

    const editButton = document.createElement('button');
    editButton.classList.add('cardHeaderBtn', 'editBtn', 'mr-3');
    editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
    `;
    editButton.onclick = (e) => onEditProjectClicked(e, project, wrapper, div);
    buttonDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('cardHeaderBtn', 'mr-1');
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    `;
    deleteButton.onclick = (e) => onDeleteProjectClicked(e, project, wrapper, div);
    buttonDiv.appendChild(deleteButton);
    header.appendChild(buttonDiv);
    div.appendChild(header);

    const tasksText = project.toDoList.length > 0 ? ('Contains: ' + project.toDoList.length + ' tasks') : 'no tasks yet';
    const body = document.createElement('div');
    body.classList.add('card-body');
    body.innerHTML = `
        <h5 class="card-title">${project.name}</h5>
        <h6 id="tasksText-${project.id}" class="card-subtitle mb-2 text-muted notes">${tasksText}</h6>
    `;
    div.onclick = () => selectProject(project.id);
    div.appendChild(body);
    wrapper.prepend(div);
}

function onEditProjectClicked(e, project, parentElement, childElement) {
    e.stopPropagation();
    document.forms['addProjectForm']['projectID'].value = project.id;
    document.forms['addProjectForm']['name'].value = project.name;
    showNewProjectContainer(true);
}

function onDeleteProjectClicked(e, project, parentElement, childElement) {
    e.stopPropagation();
    parentElement.removeChild(childElement);
    projects.splice(projects.indexOf(project), 1);
    saveToLocalStorage();
}

function selectProject(projectID) {
    const project = projects.find(p => p.id === projectID);
    if (!project) { return; }

    document.getElementById('backButton').style.display = 'block';
    document.getElementById('indexTitle').innerHTML = `&lt;todo-er/${project.name}&gt;`;
    document.getElementById('projectViews').style.display = 'none';
    document.getElementById('addTaskFormProjectID').value = projectID;
    const taskViews = document.getElementById('taskViews');
    const elements = taskViews.querySelectorAll('div.taskView');
    Object.values(elements).forEach(taskView => {
        taskViews.removeChild(taskView);
    });

    project.toDoList.forEach(task => {
        createToDo(task, project);
    });



    taskViews.style.display = 'flex';
}
