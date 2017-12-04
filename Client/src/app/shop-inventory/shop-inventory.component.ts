import { Component, OnInit } from '@angular/core';
import { ItemCategory } from '../item-category';
import { ShopItem } from '../shop-item';
import { SportShopService } from '../sport-shop.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-shop-inventory',
  templateUrl: './shop-inventory.component.html',
  styleUrls: ['./shop-inventory.component.css']
})
export class ShopInventoryComponent implements OnInit {

  availableCategories: ItemCategory[] = [];
  choosenCategories: ItemCategory[] = [];
  itemsInShop: ShopItem[] = [];
  itemNameFilteringPhase: string;

  salesObservator: Observable<any>;

  pageSize = 1;
  currentPage = 1;
  maxNumberOfPages = 1;

  constructor(private shopService: SportShopService) {
    this.salesObservator = this.shopService.getSalesObservable();
    this.salesObservator.subscribe(elem => {
      console.log('Wyłapano promocję');
      if (elem.type === 'sale-start') {
        this.setSale(elem.itemId, elem.nrOfPercentage);
      } else if (elem.type === 'sale-end') {
        this.endSale(elem.itemId);
      }
    });
  }

  ngOnInit(): void {
    this.shopService.getAvailableCategories()
      .subscribe(data => {
        this.availableCategories = data;
        this.choosenCategories = this.availableCategories.slice();
      });

    this.shopService.getItemsInShop()
      .subscribe(data => {
        this.itemsInShop = data;
        console.log(this.itemsInShop.length);
      });
  }

  categoryStateChanged(categoryStateData) {
    const name = categoryStateData.name;
    const categoryState = categoryStateData.state;

    if (categoryState) {
      this.choosenCategories.push(this.availableCategories.find(i => i.name === name));
    } else {
      const elementId = this.choosenCategories.findIndex(i => i.name === name);
      if (elementId !== -1) {
        this.choosenCategories.splice(elementId, 1);
      }
    }
  }

  setSale(itemId: string, salePercentage: number) {
    console.log('Ustawiono poczatek promocje' + itemId);
    this.itemsInShop.forEach(elem => {
      console.log(elem._id);
      if (elem._id === itemId) {
        console.log('Ustawiono promocje');
        elem.sale = salePercentage;
      }
    });
  }

  endSale(itemId: string) {
    this.itemsInShop.forEach(elem => {
      if (elem._id === itemId) {
        elem.sale = null;
      }
    });
  }

  filterItems() {
    let visibleItems = this.itemsInShop.filter(elem => elem.categories.some(i =>
      this.choosenCategories.some(j => j.name === i)
    ));

    if ((typeof this.itemNameFilteringPhase !== 'undefined') && this.itemNameFilteringPhase.length !== 0) {
      visibleItems = visibleItems.filter(elem => elem.name.indexOf(this.itemNameFilteringPhase) !== -1);
    }
    //return visibleItems;

    this.maxNumberOfPages = Math.ceil(visibleItems.length / this.pageSize);
    //console.log(this.maxNumberOfPages);

    if (this.maxNumberOfPages === 0) {
      this.maxNumberOfPages = 1;
    }

    if (this.currentPage > this.maxNumberOfPages) {
      this.currentPage = this.maxNumberOfPages;
    }
    //console.log(this.currentPage);

    this.maxNumberOfPages = this.maxNumberOfPages * 10;
    if (this.currentPage * this.pageSize > visibleItems.length) {
      return visibleItems.slice((this.currentPage - 1) * this.pageSize, visibleItems.length);
    } else {
      return visibleItems.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  }
}
