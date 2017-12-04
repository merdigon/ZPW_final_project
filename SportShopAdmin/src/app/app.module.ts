import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AdminService } from './admin.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { ShopItemListComponent } from './shop-item-list/shop-item-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order/order.component';
import { AddEditShopItemComponent } from './add-edit-shop-item/add-edit-shop-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: 'items', component: ShopItemListComponent },
  { path: '',  redirectTo: '/items', pathMatch: 'full' },
  { path: 'orders/:completed', component: OrderListComponent },
  { path: 'add-edit-shop-item/:id', component: AddEditShopItemComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    MainPageComponent,
    ShopItemComponent,
    ShopItemListComponent,
    OrderListComponent,
    OrderComponent,
    AddEditShopItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [ AdminService, HttpClient ],
  bootstrap: [AppComponent]
})
export class AppModule { }
