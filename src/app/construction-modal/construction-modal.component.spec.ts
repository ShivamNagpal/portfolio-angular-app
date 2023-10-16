import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConstructionModalComponent} from './construction-modal.component';

describe('ConstructionModalComponent', () => {
  let component: ConstructionModalComponent;
  let fixture: ComponentFixture<ConstructionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionModalComponent]
    });
    fixture = TestBed.createComponent(ConstructionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
