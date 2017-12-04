import { Component, OnInit } from '@angular/core';
import { Order } from '../order';
import { AdminService } from '../admin.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Order[];

  completed = false;

  constructor(private _dataService: AdminService, private _activatedRoute: ActivatedRoute) {
    this._dataService.getLoginObservable().subscribe(elem => this.refreshOrders());
  }

  ngOnInit() {
    this._activatedRoute.paramMap
    .subscribe((param: ParamMap) => {
      if (param.has('completed')) {
        this.completed = (param.get('completed') === 'true');
        this.refreshOrders();
      }
    });
    this.refreshOrders();
  }

  refreshOrders() {
    this._dataService.getOrders(this.completed)
    .subscribe(elem => {
      this.orders = elem;
    });
  }

  setOrderAsCompleted(orderId: String) {
    this._dataService.setOrderAsCompleted(orderId)
    .subscribe(elem => {
        this.refreshOrders();
      });
  }
}
