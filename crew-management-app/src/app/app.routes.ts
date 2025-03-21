import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/crew', pathMatch: 'full' },

    // 🟢 Crew Modülü Lazy Load
    { path: 'crew', loadChildren: () => import('./features/crew/crew.routes').then(m => m.crewRoutes) },

    // 🟢 Certificate Modülü Lazy Load
    { path: 'certificate', loadChildren: () => import('./features/certificate/certificate.routes').then(m => m.certificateRoutes) },

    { path: '**', redirectTo: '/crew/crew-list' } // 404 için
];
