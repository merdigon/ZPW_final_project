import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  login: string;
  password: string;
  wrongLoginOrPasswordMessage: boolean;

  @Output() onLogingIn = new EventEmitter<boolean>();

  constructor(private _adminService: AdminService) {
    this.login = '';
    this.password = '';
  }

  ngOnInit() {
  }

  logIn() {
    console.log('Dane: ' + this.login + ':' + this.password);
    this._adminService.logIn(this.login, this.password)
      .subscribe(elem => {
        console.log(JSON.stringify(elem));
        if (elem) {
          if (elem.result) {
            this.wrongLoginOrPasswordMessage = false;
            this._adminService.setToken(elem.user.token);
            this._adminService.notifyLogInEvent();
            this.onLogingIn.emit(true);
          } else {
            this.wrongLoginOrPasswordMessage = true;
            console.log(elem.message);
          }
        } else {
          this.wrongLoginOrPasswordMessage = true;
          console.log('Błąd podczas pobierania danych logowania');
        }
      }
    );
  }
}
