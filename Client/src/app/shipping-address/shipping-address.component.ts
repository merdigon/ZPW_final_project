import { Component, OnInit } from '@angular/core';
import { SportShopService, AddressDO } from '../sport-shop.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {

  customerName: string;
  street: string;
  buildingNumber: string;
  flatNumber: string;
  city: string;
  postalCode: string;
  country: string;

  constructor(private _service: SportShopService, private _router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._activatedRoute.paramMap
    .subscribe((param: ParamMap) => {
      this.getLastAddress();
    });
  }

  getLastAddress() {
    const user = this._service.getUser();

    if (user.id) {
      this._service.getLastAddress(user.id)
      .subscribe(elem => {
        if (elem) {
          this.street = elem.street;
          this.buildingNumber = elem.buildingNumber;
          this.flatNumber = elem.flatNumber;
          this.city = elem.city;
          this.postalCode = elem.postalCode;
          this.country = elem.country;
        }
      });
    }
  }

  submitOrder() {
    const addressObject = new AddressDO();
    addressObject.street = this.street;
    addressObject.buildingNumber = this.buildingNumber;
    addressObject.flatNumber = this.flatNumber;
    addressObject.city = this.city;
    addressObject.postalCode = this.postalCode;
    addressObject.country = this.country;
    this._service.submitOrder(this.customerName, addressObject)
    .subscribe(elem => {
        console.log('Zapisano:' + elem.response);
        this._service.resetShoppingCard()
        .subscribe(resultElem => {
          if (resultElem) {
            this._service.sendResetShoppingCard();
            this._router.navigate(['/shop-inventory']);
          }
        });
      },
              error => console.log(JSON.stringify(error)));
  }
}
