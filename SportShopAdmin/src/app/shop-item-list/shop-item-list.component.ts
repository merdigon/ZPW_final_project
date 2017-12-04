import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { AdminService } from '../admin.service';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-shop-item-list',
  templateUrl: './shop-item-list.component.html',
  styleUrls: ['./shop-item-list.component.css']
})
export class ShopItemListComponent implements OnInit {

  products: Product[];
  availableProducts: Product[];
  searchPhase: string;

  constructor(private _dataService: AdminService, private _router: Router) {
    this._dataService.getLoginObservable().subscribe(elem => {
      this.refreshProducts();
    });

    this.refreshProducts();

    _router.events
      .filter(elem => elem instanceof NavigationEnd)
      .subscribe((elem: RouterEvent) => {
        if (elem.url === '/items') {
          this.refreshProducts();
        }
      });
  }

  ngOnInit() {
  }

  refreshProducts() {
    this._dataService.getProducts()
    .subscribe(elem => {
      this.products = elem;
      this.searchPhaseChanged(this.searchPhase);
    });
  }

  searchPhaseChanged(value: string) {
    if (value === undefined || !value) {
      this.availableProducts = this.products;
      return;
    }

    this.availableProducts = [];
    this.products.forEach(elem => {
      if (elem.name.indexOf(value) !== -1) {
        this.availableProducts.push(elem);
      }
    });
  }

  onProductDelete(id: string) {
    this.refreshProducts();
  }

  addNewProduct() {
    this._router.navigate(['/add-edit-shop-item/-1']);
  }
}
