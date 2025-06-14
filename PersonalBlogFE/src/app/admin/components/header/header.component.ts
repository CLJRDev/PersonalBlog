import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public darkMode: boolean = false;

  constructor() {
    // Initialization logic can go here if needed
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

}
