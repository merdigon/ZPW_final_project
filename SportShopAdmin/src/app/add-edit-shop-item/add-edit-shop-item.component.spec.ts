import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShopItemComponent } from './add-edit-shop-item.component';

describe('AddEditShopItemComponent', () => {
  let component: AddEditShopItemComponent;
  let fixture: ComponentFixture<AddEditShopItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditShopItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShopItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
