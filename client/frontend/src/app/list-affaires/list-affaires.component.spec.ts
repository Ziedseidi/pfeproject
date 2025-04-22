import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAffairesComponent } from './list-affaires.component';

describe('ListAffairesComponent', () => {
  let component: ListAffairesComponent;
  let fixture: ComponentFixture<ListAffairesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAffairesComponent]
    });
    fixture = TestBed.createComponent(ListAffairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
