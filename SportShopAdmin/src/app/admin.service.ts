import { Injectable } from '@angular/core';
import { Product } from './product';
import { Order } from './order';
import { Observable, Subject } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AdminService {

  private _loginSubject = new Subject<boolean>();

  token: string;

  constructor(private _http: HttpClient) { }

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

    if (typeof this.token !== 'undefined') {
      header = header.set('Authorization', this.token);
    }

      return header;
  }

  logIn(login: string, password: string): Observable<LoginResult> {
    const logInDO = { login: login, password: password };
    return this._http.post<LoginResult>('http://localhost:5300/log-in', logInDO);
  }

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>('http://localhost:5300/shopItems');
  }

  getProduct(id: string): Observable<Product> {
    return this._http.get<Product>('http://localhost:5300/shopItem/' + id);
  }

  deleteProduct(id: string): Observable<boolean> {
    return this._http.delete<boolean>('http://localhost:5300/shopItem/' + id, {headers: this.getHeaderWithToken()});
  }

  postProduct(product: Product): Observable<boolean> {
    return this._http.post<boolean>('http://localhost:5300/shopItems/', product, {headers: this.getHeaderWithToken()});
  }

  putProduct(product: Product): Observable<boolean> {
    return this._http.put<boolean>('http://localhost:5300/shopItems/', product, {headers: this.getHeaderWithToken()});
  }

  getOrders(completed: boolean): Observable<Order[]> {
    return this._http.get<Order[]>('http://localhost:5300/orders?completed=' + completed);
  }

  getCategories(): Observable<Category[]> {
    return this._http.get<Category[]>('http://localhost:5300/itemCategories');
  }

  setOrderAsCompleted(orderId: String): Observable<boolean> {
    const url = 'http://localhost:5300/orderCompletation/' + orderId;
    return this._http.put<boolean>(url, { state: true }, {headers: this.getHeaderWithToken()});
  }

  setSale(productId: string, salePercentage: number, saleMinutes: number): Observable<boolean> {
    const reqBody = { item: productId, nrOfPercentage: salePercentage, nrOfMinutes: saleMinutes };
    return this._http.post<boolean>('http://localhost:5300/sales', reqBody, {headers: this.getHeaderWithToken()});
  }

  setToken(token: string) {
    this.token = token;
  }
}

class Category {
  _id: string;
  name: string;
}

class LoginResult {
  result: boolean;
  message: string;
  user: User;
}

export class User {
  id: string;
  login: string;
  token: string;
  name: string;
  surname: string;
}
