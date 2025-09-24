import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'observance',
    loadChildren: () => import('./features/observance/observance.module').then(m => m.ObservanceModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'telemedicine',
    loadChildren: () => import('./features/telemedicine/telemedicine.module').then(m => m.TelemedicineModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'teleexpertise',
    loadChildren: () => import('./features/teleexpertise/teleexpertise.module').then(m => m.TeleexpertiseModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rcp',
    loadChildren: () => import('./features/rcp/rcp.module').then(m => m.RcpModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dcc',
    loadChildren: () => import('./features/dcc/dcc.module').then(m => m.DccModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transcription',
    loadChildren: () => import('./features/transcription/transcription.module').then(m => m.TranscriptionModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }