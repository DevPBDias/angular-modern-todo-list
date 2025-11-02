import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDrop } from './components/drag-drop/drag-drop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DragDrop],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-modern-todo-list');
}
