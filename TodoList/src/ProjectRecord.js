import { ToDoRecord } from '../src/ToDoRecord.js';
export class ProjectRecord {
    constructor(name) {
        this.id = Math.random();
        this.name = name;
        this.toDoList = [];
    }

    addToList(todo) {
        if (todo instanceof ToDoRecord) {
            this.toDoList.push(todo);
        }
    }

    removeFromList(todo) {
        if (todo instanceof ToDoRecord) {
            const find = this.toDoList.find(t => t.id === todo.id);
            if (!find) { return; }
            this.toDoList.splice(this.toDoList.indexOf(find), 1);
        }
    }

    toModel() {
        return {
            id: this.id,
            name: this.name,
            toDoList: this.toDoList.map(t => t.toModel())
        }
    }
}