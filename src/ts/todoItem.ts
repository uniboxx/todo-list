export class TodoItem {
  constructor(
    public id: number,
    public task: string,
    public complete: boolean = false
  ) {}

  getDetails(): string {
    return `${this.id}\t${this.task} ${this.complete ? '\t(complete)' : ''}`;
  }

  printDetails(): void {
    console.log(this.getDetails());
  }
}
