import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPickingOrdersComponent } from './all-picking-orders.component';

describe('AllPickingOrdersComponent', () => {
  let component: AllPickingOrdersComponent;
  let fixture: ComponentFixture<AllPickingOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPickingOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPickingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
