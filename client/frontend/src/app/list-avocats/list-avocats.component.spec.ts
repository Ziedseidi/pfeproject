import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAvocatsComponent } from './list-avocats.component';

describe('ListAvocatsComponent', () => {
  let component: ListAvocatsComponent;
  let fixture: ComponentFixture<ListAvocatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAvocatsComponent]
    });
    fixture = TestBed.createComponent(ListAvocatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
