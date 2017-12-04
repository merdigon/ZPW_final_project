import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { SportShopService } from '../sport-shop.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { User } from '../user';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-shopping-card-summary',
  templateUrl: './shopping-card-summary.component.html',
  styleUrls: ['./shopping-card-summary.component.css']
})
export class ShoppingCardSummaryComponent implements OnInit {
  private _subscription: Subscription;
  numberOfProducts = 0;
  totalPrice = 0;
  user: User;

  closeResult: string;
  login: string;
  password: string;
  signInLogin: string;
  signInPassword: string;
  wrongLoginOrPasswordMessage: boolean;

  logInModalRef: NgbModalRef;
  signInModalRef: NgbModalRef;

  constructor(private _sportShop: SportShopService, private modalService: NgbModal) {
    this._subscription = _sportShop.getMessage().subscribe(msg => {
      if (msg.type === 'add') {
        this.numberOfProducts += msg.quantity;
        console.log(msg.product.sale);
        if (typeof msg.product.sale !== 'undefined') {
          this.totalPrice += ((msg.product.price * (100 - msg.product.sale)) / 100) * msg.quantity;
        } else {
          this.totalPrice += (msg.product.price * msg.quantity);
        }
      } else if (msg.type === 'reset') {
        this.numberOfProducts = 0;
        this.totalPrice = 0;
      }
    });

    this.user = _sportShop.getUser();
  }

  ngOnInit() {

  }

  getProductNumeral(): string {
    if (this.numberOfProducts === 1) {
      return 'produkt';
    } else if ([2, 3, 4].includes(this.numberOfProducts)) {
      return 'produkty';
    } else {
      return 'produktów';
    }
  }

  logIn() {
    console.log('Logowanie: ' + this.login + ':' + this.password);
    this._sportShop.logIn(this.login, this.password)
      .subscribe(elem => {
        if (elem) {
          if (elem.result) {
            this.wrongLoginOrPasswordMessage = false;
            this._sportShop.setUser(elem.user);
            this.user = elem.user;
            this._sportShop.notifyLogInEvent();

            if (this.logInModalRef) {
              this.logInModalRef.close();
            }
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

  logOut() {
    this._sportShop.logOut();
    this.user = this._sportShop.getUser();
  }

  signIn() {
    console.log('Rejestracja: ' + this.signInLogin + ':' + this.signInPassword);
    this._sportShop.signIn(this.signInLogin, this.signInPassword)
      .subscribe(elem => {
        if (elem) {
          if (elem.result) {
            this.wrongLoginOrPasswordMessage = false;
            this._sportShop.setUser(elem.user);
            this.user = elem.user;
            this._sportShop.notifyLogInEvent();

            if (this.signInModalRef) {
              this.signInModalRef.close();
            }
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

  openLogInModal(content) {
    this.logInModalRef = this.modalService.open(content);
    this.logInModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSignInModal(content) {
    this.signInModalRef = this.modalService.open(content);
    this.signInModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
