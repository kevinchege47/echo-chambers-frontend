import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactInput } from './fact-input';

describe('FactInput', () => {
  let component: FactInput;
  let fixture: ComponentFixture<FactInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
