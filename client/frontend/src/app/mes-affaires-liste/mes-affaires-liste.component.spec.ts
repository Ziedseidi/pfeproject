import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesAffairesListeComponent } from './mes-affaires-liste.component';

describe('MesAffairesListeComponent', () => {
  let component: MesAffairesListeComponent;
  let fixture: ComponentFixture<MesAffairesListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesAffairesListeComponent]
    });
    fixture = TestBed.createComponent(MesAffairesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
