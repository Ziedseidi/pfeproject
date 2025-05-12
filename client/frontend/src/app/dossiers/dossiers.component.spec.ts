import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossiersComponent } from './dossiers.component';

describe('DossiersComponent', () => {
  let component: DossiersComponent;
  let fixture: ComponentFixture<DossiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DossiersComponent]
    });
    fixture = TestBed.createComponent(DossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
