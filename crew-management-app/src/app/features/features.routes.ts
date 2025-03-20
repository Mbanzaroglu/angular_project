import { Routes } from '@angular/router';
import { CrewListComponent } from './crew/crew-list/crew-list.component';
import { CrewCardComponent } from './crew/crew-card/crew-card.component';
import { CertificateTypeModalComponent } from './certificate/certificate-type-form/certificate-type-form.component';
import { CertificateModalComponent } from './certificate/certificate-modal/certificate-modal.component';

export const featuresRoutes: Routes = [
  { path: 'crew-list', component: CrewListComponent },
  { path: 'crew-card', component: CrewCardComponent },
  { path: 'certificate-type', component: CertificateTypeModalComponent },
  { path: 'certificate-modal', component: CertificateModalComponent }
];
