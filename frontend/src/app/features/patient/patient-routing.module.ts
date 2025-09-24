import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';

const routes: Routes = [
  {
    path: '',
    component: PatientListComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: 'new',
    component: PatientFormComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: 'appointments',
    component: AppointmentListComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: 'prescriptions',
    component: PrescriptionListComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id',
    component: PatientDetailComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: ':id/edit',
    component: PatientFormComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }