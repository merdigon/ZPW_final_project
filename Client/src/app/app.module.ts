import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { ItemCategoryComponent } from './item-category/item-category.component';
import { ShoppingCardComponent } from './shopping-card/shopping-card.component';
import { ShoppingCardSummaryComponent } from './shopping-card-summary/shopping-card-summary.component';
import { SportShopService } from './sport-shop.service';
import { ShoppingCardItemComponent } from './shopping-card-item/shopping-card-item.component';
import { ShopInventoryComponent } from './shop-inventory/shop-inventory.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { CategoryFilterPipe } from './category-filter.pipe';
import { ItemNameFilterPipe } from './item-name-filter.pipe';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
// import { Ng2SliderComponent } from '../../node_modules/ng2-slider-component';

const appRoutes: Routes = [
  { path: 'shop-inventory', component: ShopInventoryComponent },
  { path: 'shopping-card',      component: ShoppingCardComponent },
  { path: 'shipping-address',      component: ShippingAddressComponent },
  { path: '',
    redirectTo: '/shop-inventory',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ShopItemComponent,
    ItemCategoryComponent,
    ShoppingCardComponent,
    ShoppingCardSummaryComponent,
    ShoppingCardItemComponent,
    ShopInventoryComponent,
    ShippingAddressComponent,
    CategoryFilterPipe,
    ItemNameFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [ SportShopService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
