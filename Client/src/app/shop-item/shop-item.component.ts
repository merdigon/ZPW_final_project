import { Component, OnInit, Input } from '@angular/core';
import { ShopItem } from '../shop-item';
import { SportShopService } from '../sport-shop.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.css']
})
export class ShopItemComponent implements OnInit {

  @Input() shopItem: ShopItem;

  constructor(private _cardService: SportShopService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  addItemToCard() {
    this._cardService.addItemToCard(this.shopItem);
  }

  isOnSale(): boolean {
    return (typeof this.shopItem.sale !== 'undefined' && this.shopItem.sale && this.shopItem.sale > 0);
  }

  isOnSaleCssClass(): string {
    if (typeof this.shopItem.sale !== 'undefined' && this.shopItem.sale && this.shopItem.sale > 0) {
      return 'price-on-sale';
    } else {
      return '';
    }
  }

  openInfoModal(content) {
    this.modalService.open(content).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed`);
    });
  }
}
