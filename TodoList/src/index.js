// import { newTask } from '../src/newTask.js';
import { createToDo } from '../src/createToDo.js';
import { createProject } from '../src/createProject.js';
import { ProjectRecord } from '../src/ProjectRecord.js';
import { ToDoRecord } from '../src/ToDoRecord.js';

export const projects = [];

const addProjectForm = document.getElementById('addProjectForm');
const addTaskForm = document.getElementById('addTaskForm');

const data = localStorage.getItem('myProjectTodoData');
if (data) { loadFromLocalStorage(data); }

if (projects.length === 0) {
    const defaultProject = new ProjectRecord('default');
    projects.push(defaultProject);
    const firstTodo = new ToDoRecord('test', 'description test', new Date(), 'high', 'my notes test');
    const check1 = firstTodo.addToCheckList('my check 1');
    check1.checked = true;
    defaultProject.addToList(firstTodo);
    
    createProject(defaultProject);
}

document.getElementById('createProjectButton').addEventListener('click', () => showNewProjectContainer());
document.getElementById('cancelNewProjectButton').addEventListener('click', () => backToProjects());

document.getElementById('createTaskButton').addEventListener('click', () => showNewTaskContainer());
document.getElementById('cancelNewTaskButton').addEventListener('click', () => backToTasks());


document.getElementById('backButton').addEventListener('click', () => backFromProject());

document.getElementById('addItemToChecklist').addEventListener('click', () => addItemToChecklist());
document.getElementById('indexTitle').addEventListener('click', function (evt) {
    if (evt.detail === 3) {
        Object.values(document.querySelectorAll('.easter')).forEach(element => {
            element.classList.toggle('hideMe');
        });
    }
});


export function showNewProjectContainer(update) {
    document.getElementById('projectViews').style.display = 'none';
    document.getElementById('newProject').style.display = 'block';
    document.getElementById('newProjectTitle').innerHTML = update ? 'Update Project' : 'New Project';
}

function backToProjects() {
    document.getElementById('newProject').style.display = 'none';
    document.getElementById('projectViews').style.display = 'flex';
    document.forms['addProjectForm']['projectID'].value = '';
    addProjectForm.reset();
    addProjectForm.classList.remove('was-validated');
}

function backFromProject() {
    document.getElementById('indexTitle').innerHTML = '&lt;todo-er/&gt;';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('taskViews').style.display = 'none';
    document.getElementById('projectViews').style.display = 'flex';
}

export function showNewTaskContainer(update) {
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('taskViews').style.display = 'none';
    document.getElementById('newTask').style.display = 'block';
    document.getElementById('newTaskTitle').innerHTML = update ? 'Update Task' : 'New Task';
}

function backToTasks() {
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('newTask').style.display = 'none';
    document.getElementById('taskViews').style.display = 'flex';
    document.getElementById('checklistDiv').innerHTML = '';
    document.forms['addTaskForm']['todoID'].value = '';
    addTaskForm.reset();
    addTaskForm.classList.remove('was-validated');
}

export function addItemToChecklist(check) {
   const phrases = [
      "don't forget my keys",
      "clean the dishes first",
      "buy a boat",
      "invent time travel",
      "pray for [insert_var_here]",
      "buy the dip",
      "flush the toilet",
      "clean my room",
      "start investing",
      "turn off the A/C",
      "no example ideas left.."
   ];
   const parent = document.getElementById('checklistDiv');
    /*
        <div class="input-group mb-2">
            <div class="input-group-prepend">
                <button type="button" class="btn btn-danger input-group-button">X</button>
            </div>
            <input type="text"
                class="form-control"
                id="checklist-item-0"
                name="checklist-item-0"
                placeholder="e.g. don't forget my keys">
            <input type="hidden"
                id="checklist-valueof-item-0"
                name="checklist-valueof-item-0"
                value="false">
        </div>
    */
   const wrapper = document.createElement('div');
   wrapper.classList.add('input-group', 'mb-2');
   const buttonDiv = document.createElement('div');
   buttonDiv.classList.add('input-group-prepend');
   const xButton = document.createElement('button');
   xButton.classList.add('btn', 'btn-danger', 'input-group-button');
   xButton.innerHTML = 'X';
   xButton.addEventListener('click', () => deleteThisInput(wrapper, parent));
   buttonDiv.appendChild(xButton);
   wrapper.appendChild(buttonDiv);

   const input = document.createElement('input');
   input.type = 'text';
   input.classList.add('form-control');
   const id = check ? check.id : Math.random();
   input.id = 'checklist-item-' + id;
   input.name = 'checklist-item-' + id;
   input.placeholder = 'e.g. ' + phrases[Math.floor(Math.random() * (10 + 1))];
   input.value = check ? check.title : '';
   wrapper.appendChild(input);

   const inputValue = document.createElement('input');
   inputValue.type = 'hidden';
   inputValue.id = 'checklist-valueof-item-' + id;
   inputValue.name = 'checklist-valueof-item-' + id;
   inputValue.value = check?.checked ? 'true' : 'false';
   wrapper.appendChild(inputValue);

   parent.appendChild(wrapper);
}

export function deleteThisInput(wrapper, parent) {
    parent.removeChild(wrapper);
}

function _createToDo(todo, project) {
    createToDo(todo, project);
}

function loadFromLocalStorage(data) {
    if (!data) { return; }
    const _projects = JSON.parse(data);
    _projects.forEach(p => {
        const project = new ProjectRecord(p.name);
        project.id = p.id;
        p.toDoList?.forEach(t => {
            const dueDate = t.dueDate ? new Date(t.dueDate) : null;
            const todo = new ToDoRecord(t.title, t.description, dueDate, t.priority, t.notes);
            todo.id = t.id;
            todo.completed = t.completed ? new Date(t.completed) : null;
            todo.createdDate = new Date(t.createdDate);
            t.checklist?.forEach(c => {
                const check = todo.addToCheckList(c.title, c.id);
                check.checked = c.checked;
            });
            project.addToList(todo);
        });
        projects.push(project);
        createProject(project);
    });
}

export function saveToLocalStorage() {
    localStorage.setItem('myProjectTodoData', JSON.stringify(projects.map(project => project.toModel())));
}

(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addProjectForm.classList.add('was-validated');
            if (addProjectForm.checkValidity() === false) { return; }

            // Form is valid so we continue proccessing data
            const formData = new FormData(e.target);
            const name = formData.get('name');

            const projectID = formData.get('projectID');
            let project = projects.find(p => String(p.id) === projectID);
            if (project) {
                project.name = name;
                const projectViewDiv = document.getElementById('project-' + project.id);
                projectViewDiv.parentElement.removeChild(projectViewDiv);
            } else {
                project = new ProjectRecord(name);
                projects.push(project);
            }

            createProject(project);
            backToProjects();
            saveToLocalStorage();
        }, false);

        addTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addTaskForm.classList.add('was-validated');
            if (addTaskForm.checkValidity() === false) { return; }

            // Form is valid so we continue proccessing data
            const formData = new FormData(e.target);
            const projectID = formData.get('projectID');
            const project = projects.find(p => String(p.id) === projectID);
            if (!project) { return; }

            // Project found so we continue
            const title = formData.get('title');
            const description = formData.get('description');
            const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate')) : null;
            const priority = formData.get('priority');
            const notes = formData.get('notes');
            const todoID = formData.get('todoID');

            let todo = project.toDoList.find(todo => String(todo.id) === todoID);
            if (todo) {
               todo.title = title;
               todo.description = description;
               todo.dueDate = dueDate;
               todo.priority = priority;
               todo.notes = notes;
               todo.checklist = [];
               formData.forEach((value, key) => {
                    if (!key.includes('checklist-item-')) { return; }
                    const id = key.split('checklist-item-')[1];
                    todo.addToCheckList(value, id);
                });
                todo.checklist.forEach(check => {
                    const value = formData.get('checklist-valueof-item-' + check.id);
                    check.checked = value === 'true';
                });
                
              const taskViewDiv = document.getElementById('task-' + todo.id);
              taskViewDiv.parentElement.removeChild(taskViewDiv);
            } else {
               todo = new ToDoRecord(title, description, dueDate, priority, notes);
               formData.forEach((value, key) => {
                   if (!key.includes('checklist-item-')) { return; }
                   todo.addToCheckList(value);
               });
               project.addToList(todo);
            }

            _createToDo(todo, project);
            backToTasks();
            saveToLocalStorage();
        }, false);
    }, false);
})();