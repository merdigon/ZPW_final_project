import { Component, OnInit } from '@angular/core';
import { ShoppingCard } from '../shopping-card';
import { SportShopService } from '../sport-shop.service';

@Component({
  selector: 'app-shopping-card',
  templateUrl: './shopping-card.component.html',
  styleUrls: ['./shopping-card.component.css']
})
export class ShoppingCardComponent implements OnInit {

  shoppingCard: ShoppingCard;
  constructor(private sportShopService: SportShopService) { }

  ngOnInit() {
    this.shoppingCard = this.sportShopService.getShoppingCard();
  }
}
