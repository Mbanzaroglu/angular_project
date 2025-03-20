import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewModalComponent } from './crew-modal.component';

describe('CrewModalComponent', () => {
  let component: CrewModalComponent;
  let fixture: ComponentFixture<CrewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
