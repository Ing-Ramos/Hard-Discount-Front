import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasComponent } from './entregas';

describe('Entregas', () => {
  let component: EntregasComponent;
  let fixture: ComponentFixture<EntregasComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(EntregasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
