import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-input.html',
})
export class TodoInput {
  @Input() placeholder: string = 'Digite uma nova tarefa...';
  @Output() taskAdded = new EventEmitter<string>();

  newTaskText: string = '';

  onSubmit() {
    if (this.newTaskText.trim()) {
      this.taskAdded.emit(this.newTaskText.trim());
      this.newTaskText = '';
    }
  }
}
