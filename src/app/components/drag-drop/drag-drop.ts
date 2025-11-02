import { Component, signal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { PomodoroTimer } from '../pomodoro-timer/pomodoro-timer';

@Component({
  selector: 'drag-drop',
  standalone: true,
  imports: [CdkDrag, PomodoroTimer],
  templateUrl: './drag-drop.html',
  styleUrls: ['./drag-drop.css'],
})
export class DragDrop {
  showPomodoro = signal(false);

  togglePomodoro(): void {
    this.showPomodoro.update((showPomodoro) => !showPomodoro);
  }
}
