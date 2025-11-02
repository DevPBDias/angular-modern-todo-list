import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Task } from '../../types/task.types';

@Component({
  selector: 'app-todo-task-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-task-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTaskItem implements AfterViewInit {
  @Input() task!: Task;
  @Input() editingText: string = '';
  @Output() toggleCompleteEvent = new EventEmitter<Task>();
  @Output() editEvent = new EventEmitter<Task>();
  @Output() saveEditEvent = new EventEmitter<{ task: Task; text: string }>();
  @Output() cancelEditEvent = new EventEmitter<Task>();
  @Output() removeEvent = new EventEmitter<number>();

  currentEditText: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onToggleComplete() {
    this.toggleCompleteEvent.emit(this.task);
  }

  onEdit() {
    this.currentEditText = this.task.text;
    this.editEvent.emit(this.task);
  }

  onSaveEdit() {
    if (this.task.editing) {
      this.saveEditEvent.emit({ task: this.task, text: this.currentEditText });
    }
  }

  onCancelEdit() {
    this.cancelEditEvent.emit(this.task);
  }

  onRemove() {
    this.removeEvent.emit(this.task.id);
  }

  onEditInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.currentEditText = input.value;
  }

  ngAfterViewInit() {
    // Se estiver em modo de edição ao carregar, focar no input
    if (this.task.editing && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const input = document.querySelector(
          `input[data-task-id="${this.task.id}"]`
        ) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  }
}
