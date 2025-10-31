import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { navLinks, ILinks } from '../../constants/navLinks';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showNavbar = false;
  navLinks: ILinks[] = navLinks;

  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  closeNavbar() {
    this.showNavbar = false;
  }
}
