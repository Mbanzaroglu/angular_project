import { Routes } from '@angular/router';
import { CertificateTypeModalComponent } from './certificate-type-form/certificate-type-form.component';
import { AddCertificateModalComponent } from './add-certificate-modal/add-certificate-modal.component';

export const certificateRoutes: Routes = [
  { path: 'certificate-type-form', component: CertificateTypeModalComponent },
  { path: 'add-certificate-modal', component: AddCertificateModalComponent }
];
