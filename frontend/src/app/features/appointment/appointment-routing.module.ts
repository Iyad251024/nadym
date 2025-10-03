import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentDashboardComponent } from './components/appointment-dashboard/appointment-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentDashboardComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }