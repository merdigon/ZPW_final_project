import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '../order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor() {
  }

  @Input() orderData: Order;
  @Output() completedClickEvent = new EventEmitter<String>();

  detailsHidden = true;

  ngOnInit() {
  }

  onCardClick() {
    this.detailsHidden = !this.detailsHidden;
  }

  setAsCompleted() {
    this.completedClickEvent.emit(this.orderData._id);
  }
}
