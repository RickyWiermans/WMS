import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPickingOrderComponent } from './current-picking-order.component';

describe('CurrentPickingOrderComponent', () => {
  let component: CurrentPickingOrderComponent;
  let fixture: ComponentFixture<CurrentPickingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPickingOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPickingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
