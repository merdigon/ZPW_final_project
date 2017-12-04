import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCardItemComponent } from './shopping-card-item.component';

describe('ShoppingCardItemComponent', () => {
  let component: ShoppingCardItemComponent;
  let fixture: ComponentFixture<ShoppingCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
