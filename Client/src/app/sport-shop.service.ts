import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemCategory } from './item-category';
import { ShopItem } from './shop-item';
import { User } from './user';
import { ShoppingCard } from './shopping-card';
import * as Rx from 'rxjs/rx';
import * as sioc from 'socket.io-client';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Injectable()
export class SportShopService {

  private availableCategories: Observable<ItemCategory[]>;
  private itemsInShop: Observable<ShopItem[]>;
  private shoppingCardSubject = new Subject<any>();
  private salesSubject = new Subject<any>();
  private shoppingCard: ShoppingCard;

  private _loginSubject = new Subject<boolean>();

  loggedUser: User;

  constructor(private _http: HttpClient) {
    this.shoppingCard = new ShoppingCard();
    this.loggedUser = new User();
    this.selectAvailableCategories();
    this.selectItemsInShop();

    const socket = sioc.connect('http://localhost:5300');
    socket.on('message', (data) => {
      console.log('SIOC: ' + JSON.stringify(data));
      this.salesSubject.next(data);
    });
  }

  getSalesObservable(): Observable<any> {
    return this.salesSubject.asObservable();
  }

  selectAvailableCategories() {
    this.availableCategories = this._http.get<ItemCategory[]>('http://localhost:5300/itemcategories');
  }

  selectItemsInShop() {
    this.itemsInShop = this._http.get<ShopItem[]>('http://localhost:5300/shopitems');
  }

  getAvailableCategories(): Observable<ItemCategory[]> {
    return this.availableCategories;
  }

  getItemsInShop(): Observable<ShopItem[]> {
    return this.itemsInShop;
  }

  setUser(user: User) {
    this.loggedUser = user;
  }

  getUser(): User {
    return this.loggedUser;
  }

  getLoginObservable(): Observable<boolean> {
    return this._loginSubject.asObservable();
  }

  notifyLogInEvent() {
    this._loginSubject.next(true);
  }

  getHeaderWithToken(): HttpHeaders {
    let header = new HttpHeaders();
      // .set('Access-Control-Allow-Headers', 'Content-Type')
      // .set('Access-Control-Allow-Origin', '*');

    if (this.loggedUser.id) {
      header = header.set('Authorization', this.loggedUser.token);
    }

    return header;
  }

  logIn(login: string, password: string): Observable<LoginResult> {
    const logInDO = { login: login, password: password };
    return this._http.post<LoginResult>('http://localhost:5300/log-in', logInDO);
  }

  signIn(login: string, password: string): Observable<LoginResult> {
    const logInDO = { login: login, password: password };
    return this._http.post<LoginResult>('http://localhost:5300/sign-in', logInDO);
  }

  logOut() {
    this.loggedUser = new User();
  }

  addItemToCard(item: ShopItem) {
    this.shoppingCard.addItem(item, 1);
    this.sendAddedItem(item);
  }

  removeItemFromCard(item: ShopItem) {
    this.shoppingCard.removeItem(item, 1);
    this.sendRemovedItem(item, -1);
  }

  removeItemFromCardCompletly(item: ShopItem) {
    const number = this.shoppingCard.removeItemCompletly(item);
    this.sendRemovedItem(item, number * (-1));
  }

  private sendAddedItem(item: ShopItem) {
    this.shoppingCardSubject.next({ type: 'add', product: item, quantity: 1 });
  }

  private sendRemovedItem(item: ShopItem, quantity: number) {
    this.shoppingCardSubject.next({ type: 'add', product: item, quantity: quantity });
  }

  sendResetShoppingCard() {
    this.shoppingCardSubject.next({ type: 'reset', product: null, quantity: 0 });
  }

  getMessage(): Observable<any> {
    return this.shoppingCardSubject.asObservable();
  }

  getShoppingCard(): ShoppingCard {
    return this.shoppingCard;
  }

  submitOrder(customerName: string, customerAddress: AddressDO): Observable<any> {
    const positionsDo = [];
    this.shoppingCard.cardPositions.forEach(elem => positionsDo.push(new OrderPositionDO(elem.item._id, elem.item.name, elem.quantity, elem.price)));
    const order = new OrderDO(customerName, customerAddress, positionsDo);
    console.log(JSON.stringify(this.getHeaderWithToken()));
    return this._http.post<any>('http://localhost:5300/orders', order, { headers: this.getHeaderWithToken()} );
  }

  resetShoppingCard(): Observable<boolean> {
    if (this.loggedUser.id) {
      return this._http.delete<boolean>('http://localhost:5300/tmpShoppingCard', { headers: this.getHeaderWithToken()} )
      .switchMap(elem => {
          if (elem) {
            this.shoppingCard = new ShoppingCard();
          }
          return Observable.of(elem);
        });
    } else {
      this.shoppingCard = new ShoppingCard();
      return Observable.of(true);
    }
  }

  getLastAddress(userId: string): Observable<AddressDO> {
    return this._http.get<AddressDO>('http://localhost:5300/userAddress/' + userId, { headers: this.getHeaderWithToken()});
  }
}

class LoginResult {
  result: boolean;
  message: string;
  user: User;
}

class OrderDO {
  id: string;
  customerName: string;
  customerAddress: AddressDO;
  positions: OrderPositionDO[];

  constructor(_customerName: string, _customerAddress: AddressDO, _positions: OrderPositionDO[]) {
    this.customerName = _customerName;
    this.customerAddress = _customerAddress;
    this.positions = _positions;
  }
}

class OrderPositionDO {
  id: string;
  shopItemId: string;
  shopItemName: string;
  quantity: number;
  price: number;

  constructor(_shopItemId: string, _shopItemName: string, _quantity: number, _price: number) {
    this.shopItemId = _shopItemId;
    this.shopItemName = _shopItemName;
    this.quantity = _quantity;
    this.price = _price;
  }
}

export class AddressDO {
  street: string;
  buildingNumber: string;
  flatNumber: string;
  city: string;
  postalCode: string;
  country: string;
}
