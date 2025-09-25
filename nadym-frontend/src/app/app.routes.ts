import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent) },
  { path: 'observance', loadComponent: () => import('./features/observance/observance.component').then(m => m.ObservanceComponent) },
  { path: 'telemedicine', loadComponent: () => import('./features/telemedicine/telemedicine.component').then(m => m.TelemedicineComponent) },
  { path: 'interoperability', loadComponent: () => import('./features/interoperability/interoperability.component').then(m => m.InteroperabilityComponent) },
  { path: 'security', loadComponent: () => import('./features/security/security.component').then(m => m.SecurityComponent) },
  { path: 'teleexpertise', loadComponent: () => import('./features/teleexpertise/teleexpertise.component').then(m => m.TeleexpertiseComponent) },
  { path: 'rcp', loadComponent: () => import('./features/rcp/rcp.component').then(m => m.RcpComponent) },
  { path: 'dcc', loadComponent: () => import('./features/dcc/dcc.component').then(m => m.DccComponent) },
  { path: 'transcription', loadComponent: () => import('./features/transcription/transcription.component').then(m => m.TranscriptionComponent) },
];
