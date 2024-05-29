import { TodoItem } from './todoItem';

type ItemCounts = {
  total: number;
  incomplete: number;
};

export class TodoCollection {
  private nextId: number = 1;
  private itemMap = new Map<number, TodoItem>();
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private element: HTMLElement;
  private listEl: HTMLUListElement;

  constructor(public userName: string, public todoItems: TodoItem[] = []) {
    todoItems.forEach(item => this.itemMap.set(item.id, item));

    this.templateEl = document.getElementById(
      'todo-project'
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    const heading1 = this.element.querySelector('h1')! as HTMLHeadingElement;
    heading1.textContent = `${this.userName} todo list`;

    this.listEl = <HTMLUListElement>this.element.querySelector('ul');

    this.#attach();
    this.#renderList();
  }

  #renderList() {
    this.listEl.innerHTML = '';
    this.getTodoItems(true).forEach(item => {
      this.#renderItem(item);
    });
  }

  #renderItem(item: TodoItem | undefined) {
    if (!item) return;
    const listEl = this.element.querySelector('ul') as HTMLUListElement;
    const listItemEl = document.createElement('li');
    listItemEl.id = item.id.toString();
    listItemEl.textContent = item.getDetails();
    listEl.appendChild(listItemEl);
  }

  #attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.element);
  }

  getTodoById(id: number): TodoItem | undefined {
    return this.itemMap.get(id);
  }

  getTodoItems(includeComplete: boolean): TodoItem[] {
    return [...this.itemMap.values()].filter(
      item => includeComplete || !item.complete
    );
  }

  addTodo(task: string): number {
    while (this.getTodoById(this.nextId)) {
      this.nextId++;
    }
    this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
    this.#renderItem(this.itemMap.get(this.nextId));
    return this.nextId;
  }

  markComplete(id: number, complete: boolean) {
    const todoItem = this.getTodoById(id);
    if (todoItem) {
      todoItem.complete = complete;
    }
  }

  removeComplete() {
    this.itemMap.forEach(item => {
      if (item.complete) {
        this.itemMap.delete(item.id);
        const listItemEl = this.listEl.querySelector(
          `li[id="${item.id}"]`
        ) as HTMLLIElement;
        this.listEl.removeChild(listItemEl);
      }
    });
  }

  getItemCounts(): ItemCounts {
    return {
      total: this.itemMap.size,
      incomplete: this.getTodoItems(false).length,
    };
  }
}
