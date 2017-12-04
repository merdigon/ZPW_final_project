import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInventoryComponent } from './shop-inventory.component';

describe('ShopInventoryComponent', () => {
  let component: ShopInventoryComponent;
  let fixture: ComponentFixture<ShopInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
