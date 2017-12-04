import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Product } from '../product';
import { AdminService } from '../admin.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-add-edit-shop-item',
  templateUrl: './add-edit-shop-item.component.html',
  styleUrls: ['./add-edit-shop-item.component.css']
})
export class AddEditShopItemComponent implements OnInit {

  constructor(private _dataService: AdminService, private _activatedRoute: ActivatedRoute, private _router: Router) {
    this.product = new Product();
  }

  categories: string[];
  possibleCategories: string[];
  product: Product;

  ngOnInit() {
    this._activatedRoute.paramMap
      .subscribe((param: ParamMap) => {
        if (param.has('id')) {
          if (param.get('id') === '-1') {
            this.product = new Product();
          } else {
            this._dataService.getProduct(param.get('id'))
              .subscribe(elem => this.product = elem);
          }
        } else {
          this.product = new Product();
        }
      });

    this._dataService.getCategories()
      .subscribe(elem => {
        this.categories = elem.map(cat => cat.name);
      });
  }

  onSaveClick() {
    let subscriber: Observable<boolean>;
    if (this.product) {
      if (this.product._id) {
        subscriber = this._dataService.putProduct(this.product);
      } else {
        subscriber = this._dataService.postProduct(this.product);
      }
      subscriber.subscribe(elem => {
        console.log(elem);
        if (elem) {
          console.log('Zakoczono update');
          this._router.navigate(['/items']);
        }
      });
    }
  }
}
