import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product';
import { AdminService } from '../admin.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.css']
})
export class ShopItemComponent implements OnInit {

  @Input() productData: Product;
  @Output() onDeleteProduct = new EventEmitter<string>();

  salePercent: number;
  saleMinutes: number;

  saleModalRef: NgbModalRef;

  constructor(private _dataService: AdminService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit() {
  }

  editProduct() {
    this.router.navigate(['/add-edit-shop-item/' + this.productData._id]);
  }

  deleteProduct() {
    this._dataService.deleteProduct(this.productData._id)
    .subscribe(elem => {
      console.log(JSON.stringify(elem));
      if (elem === true) {
        console.log('Udało się poprawnie usunąć produkt');
        this.onDeleteProduct.emit(this.productData._id);
      } else {
        console.log('Nie udało się poprawnie usunąć produktu');
      }
      this.router.navigate(['/items']);
    });
  }

  showSaleModal(content) {
    this.saleModalRef = this.modalService.open(content);
    this.saleModalRef.result.then((result) => {});
  }

  setSale() {
    this._dataService.setSale(this.productData._id, this.salePercent, this.saleMinutes)
    .subscribe(elem => {
      if (elem) {
        this.saleModalRef.close();
      }
    });
  }
}
