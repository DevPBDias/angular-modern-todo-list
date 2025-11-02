import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-todo-stats',
  standalone: true,
  imports: [],
  templateUrl: './todo-stats.html',
})
export class TodoStats {
  @Input() completedCount: number = 0;
  @Input() totalCount: number = 0;
}
