import { Routes } from '@angular/router';
import { CrewListComponent } from './crew-list/crew-list.component';
import { CrewCardComponent } from './crew-card/crew-card.component';

export const crewRoutes: Routes = [
  { path: '', redirectTo: 'crew-list', pathMatch: 'full' }, // Doğru yönlendirme
  { path: 'crew-list', component: CrewListComponent },
  { path: 'crew-card/:id', component: CrewCardComponent }
];

