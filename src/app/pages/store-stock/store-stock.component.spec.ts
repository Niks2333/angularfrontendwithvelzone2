import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreStockComponent } from './store-stock.component';

describe('StoreStockComponent', () => {
  let component: StoreStockComponent;
  let fixture: ComponentFixture<StoreStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
