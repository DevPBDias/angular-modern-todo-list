import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface PomodoroState {
  timeLeft: number;
  mode: 'work' | 'break';
  isRunning: boolean;
  lastUpdated: number;
}

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pomodoro-timer.html',
  styleUrls: ['./pomodoro-timer.css'],
})
export class PomodoroTimer implements OnInit, OnDestroy {
  private intervalId: number | null = null;
  private audio: HTMLAudioElement | null = null;
  isBrowser = false;

  readonly timeLeft = signal(25 * 60);
  readonly isRunning = signal(false);
  readonly mode = signal<'work' | 'break'>('work');
  readonly customTime = signal(25);
  readonly flashEffect = signal(false);
  readonly soundEnabled = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.audio = new Audio('/audio/timer-end.mp3');
      this.restoreState();
    }
  }

  private saveState(): void {
    if (!this.isBrowser) return;
    const state: PomodoroState = {
      timeLeft: this.timeLeft(),
      mode: this.mode(),
      isRunning: this.isRunning(),
      lastUpdated: Date.now(),
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }

  private restoreState(): void {
    const saved = localStorage.getItem('pomodoroState');
    if (!saved) return;

    const state: PomodoroState = JSON.parse(saved);
    const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);

    let newTime = state.timeLeft - (state.isRunning ? elapsed : 0);

    if (newTime <= 0) {
      this.switchMode();
      newTime = this.timeLeft();
    }

    this.timeLeft.set(newTime);
    this.mode.set(state.mode);
    this.isRunning.set(state.isRunning);

    if (state.isRunning) this.startTimer();
  }

  get minutes(): string {
    return Math.floor(this.timeLeft() / 60)
      .toString()
      .padStart(2, '0');
  }

  get seconds(): string {
    return (this.timeLeft() % 60).toString().padStart(2, '0');
  }

  toggleTimer(): void {
    this.isRunning() ? this.pauseTimer() : this.startTimer();
  }

  startTimer(): void {
    if (!this.isRunning() && this.isBrowser) {
      this.isRunning.set(true);
      this.intervalId = window.setInterval(() => {
        if (this.timeLeft() > 0) {
          this.timeLeft.update((v) => v - 1);
        } else {
          this.playAlert();
          this.switchMode();
        }
        this.saveState();
      }, 1000);
    }
  }

  pauseTimer(): void {
    if (this.intervalId && this.isBrowser) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning.set(false);
    this.saveState();
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeLeft.set(this.customTime() * 60);
    this.saveState();
  }

  switchMode(): void {
    this.pauseTimer();
    this.mode.update((m) => (m === 'work' ? 'break' : 'work'));
    const newTime = this.mode() === 'work' ? this.customTime() * 60 : 5 * 60;
    this.timeLeft.set(newTime);
    this.saveState();
  }

  enableSound(): void {
    if (!this.isBrowser || !this.audio) return;
    this.audio
      .play()
      .then(() => {
        this.audio!.pause();
        this.audio!.currentTime = 0;
        this.soundEnabled.set(true);
      })
      .catch(() => console.warn('⚠️ Som bloqueado pelo navegador.'));
  }

  private playAlert(): void {
    if (!this.isBrowser || !this.soundEnabled()) return;
    try {
      this.audio?.play();
    } catch {}
    this.flashEffect.set(true);
    setTimeout(() => this.flashEffect.set(false), 2500);
  }

  ngOnDestroy(): void {
    if (this.intervalId && this.isBrowser) clearInterval(this.intervalId);
    this.saveState();
  }
}
