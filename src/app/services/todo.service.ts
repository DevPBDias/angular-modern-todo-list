import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Task } from '../pages/todo-list/types/task.types';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'tasks';
  private _tasks = signal<Task[]>([]);
  private _nextId = signal<number>(1);

  readonly tasks = this._tasks.asReadonly();
  readonly nextId = this._nextId.asReadonly();
  readonly totalTasksCount = computed(() => this._tasks().length);
  readonly completedTasksCount = computed(() => this._tasks().filter((t) => t.completed).length);

  constructor() {
    this.loadTasks();
  }

  addTask(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: this._nextId(),
      text: trimmed,
      completed: false,
      editing: false,
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    this._nextId.update((id) => id + 1);
    this.saveTasks();
  }

  removeTask(id: number): void {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    this.saveTasks();
  }

  toggleComplete(task: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
    );
    this.saveTasks();
  }

  startEditing(task: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...t, editing: true } : { ...t, editing: false })),
    );
  }

  saveEdit(task: Task, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      this.cancelEdit(task);
      return;
    }

    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...t, text: trimmed, editing: false } : t)),
    );
    this.saveTasks();
  }

  cancelEdit(task: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...t, editing: false } : t)),
    );
  }

  private saveTasks(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._tasks()));
      } catch (error) {
        console.error('Erro ao salvar tarefas no localStorage:', error);
      }
    }
  }

  private loadTasks(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedTasks = localStorage.getItem(this.STORAGE_KEY);
        if (savedTasks) {
          const tasks: Task[] = JSON.parse(savedTasks);
          this._tasks.set(tasks);

          if (tasks.length > 0) {
            const maxId = Math.max(...tasks.map((t) => t.id));
            this._nextId.set(maxId + 1);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas do localStorage:', error);
        this._tasks.set([]);
      }
    }
  }
}
