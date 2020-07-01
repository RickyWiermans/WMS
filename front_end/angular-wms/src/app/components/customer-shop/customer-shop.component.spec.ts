import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShopComponent } from './customer-shop.component';

describe('CustomerShopComponent', () => {
  let component: CustomerShopComponent;
  let fixture: ComponentFixture<CustomerShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
