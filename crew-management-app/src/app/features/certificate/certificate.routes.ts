import { Routes } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateModalComponent } from './certificate-modal/certificate-modal.component';
import { CertificateTypeFormComponent } from './certificate-type-form/certificate-type-form.component';

export const certificateRoutes: Routes = [
  { path: 'certificate-list', component: CertificateListComponent },
  { path: 'certificate-modal', component: CertificateModalComponent },
  { path: 'certificate-type-form', component: CertificateTypeFormComponent }
  
];
