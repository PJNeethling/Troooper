import { Component, OnInit } from '@angular/core';
import { AuthService } from "./shared/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PJTrooper';

  constructor(private authService: AuthService) { }

  userStatus = this.authService.userStatus;

  logout() {
    this.authService.logOut();

  }


  ngOnInit() {
    this.authService.userChanges();

    this.authService.userStatusChanges.subscribe(x => this.userStatus = x);
  }



}
