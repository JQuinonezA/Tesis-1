import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContratosComponent } from './gestion-contratos.component';

describe('GestionContratosComponent', () => {
  let component: GestionContratosComponent;
  let fixture: ComponentFixture<GestionContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
