import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { RouterOutlet } from '@angular/router';
import { BackgroundImage } from '../../components/background-image/background-image';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet, BackgroundImage],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
