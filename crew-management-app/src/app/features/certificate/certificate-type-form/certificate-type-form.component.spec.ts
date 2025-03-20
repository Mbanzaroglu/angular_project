import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTypeFormComponent } from './certificate-type-form.component';

describe('CertificateTypeFormComponent', () => {
  let component: CertificateTypeFormComponent;
  let fixture: ComponentFixture<CertificateTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
