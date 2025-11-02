import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './types/task.types';
import { TodoInput } from './components/todo-input/todo-input';
import { TodoTaskItem } from './components/todo-task-item/todo-task-item';
import { TodoStats } from './components/todo-stats/todo-stats';
import { TodoEmptyState } from './components/todo-empty-state/todo-empty-state';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, TodoInput, TodoTaskItem, TodoStats, TodoEmptyState],
  templateUrl: './todo-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  private readonly todoService = inject(TodoService);

  readonly tasks = this.todoService.tasks;
  readonly completedTasksCount = this.todoService.completedTasksCount;
  readonly totalTasksCount = this.todoService.totalTasksCount;

  onTaskAdded(taskText: string): void {
    this.todoService.addTask(taskText);
  }

  onToggleComplete(task: Task): void {
    this.todoService.toggleComplete(task);
  }

  onEditTask(task: Task): void {
    this.todoService.startEditing(task);
  }

  onSaveEdit(payload: { task: Task; text: string }): void {
    this.todoService.saveEdit(payload.task, payload.text);
  }

  onCancelEdit(task: Task): void {
    this.todoService.cancelEdit(task);
  }

  onRemoveTask(id: number): void {
    this.todoService.removeTask(id);
  }
}
