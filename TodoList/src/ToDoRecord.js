export class ToDoRecord {
    completed = null;
    constructor(title, description, dueDate, priority, notes) {
        this.id = Math.random();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.createdDate = new Date();
    }

    createCheckList() {
        if (this.checklist) { return; }
        this.checklist = [];
    }

    addToCheckList(title, id) {
        const check = {
            id: id ? id : Math.random(),
            title,
            checked: false
        };
        if (!this.checklist) { this.createCheckList(); }
        this.checklist.push(check);
        return check;
    }

    removeFromCheckList(id) {
        const find = this.checklist?.find(c => c.id === id);
        if (!find) { return; }
        this.checklist.splice(this.checklist.indexOf(find), 1);
    }

    toModel() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            notes: this.notes,
            createdDate: this.createdDate,
            completed: this.completed,
            checklist: this.checklist
        }
    }
}