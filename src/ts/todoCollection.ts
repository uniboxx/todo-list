import { TodoItem } from './todoItem';

export class TodoCollection {
  private nextId: number = 1;
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private element: HTMLElement;

  constructor(public userName: string, public todoItems: TodoItem[] = []) {
    this.templateEl = document.getElementById(
      'todo-project'
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    const heading1 = this.element.querySelector('h1')! as HTMLHeadingElement;
    heading1.textContent = `${this.userName} todo list`;

    this.#attach();
    this.#renderList();
  }

  #renderList() {
    const listEl = this.element.querySelector('ul')! as HTMLUListElement;
    listEl.innerHTML = '';
    this.todoItems.forEach(el => {
      const listItem = document.createElement('li');
      listItem.textContent = el.getDetails();
      listEl.appendChild(listItem);
    });
  }

  #attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.element);
  }

  getTodoById(id: number): TodoItem | undefined {
    return this.todoItems.find(item => item.id === id);
  }

  addTodo(task: string): number {
    while (this.getTodoById(this.nextId)) {
      this.nextId++;
    }
    this.todoItems.push(new TodoItem(this.nextId, task));
    this.#renderList();
    return this.nextId;
  }

  markComplete(id: number, complete: boolean) {
    const todoItem = this.getTodoById(id);
    if (todoItem) {
      todoItem.complete = complete;
    }
  }
}
