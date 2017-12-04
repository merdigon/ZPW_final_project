import { Component, OnInit, Input } from '@angular/core';
import { ShoppingOrderPosition } from '../shopping-order-position';
import { ShoppingCard } from '../shopping-card';
import { SportShopService } from '../sport-shop.service';

@Component({
  selector: '[app-shopping-card-item]',
  templateUrl: './shopping-card-item.component.html',
  styleUrls: ['./shopping-card-item.component.css']
})
export class ShoppingCardItemComponent implements OnInit {

  @Input() shoppingOrder: ShoppingOrderPosition;

  constructor(private _sportShopService: SportShopService) { }

  ngOnInit() {
  }

  removeItem() {
    this._sportShopService.removeItemFromCard(this.shoppingOrder.item);
  }

  removeItemCompletly() {
    this._sportShopService.removeItemFromCardCompletly(this.shoppingOrder.item);
  }
}
