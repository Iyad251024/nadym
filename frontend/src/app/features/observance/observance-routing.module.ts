import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicationListComponent } from './components/medication-list/medication-list.component';
import { IntakeTrackingComponent } from './components/intake-tracking/intake-tracking.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
import { AdherenceReportComponent } from './components/adherence-report/adherence-report.component';

const routes: Routes = [
  {
    path: '',
    component: MedicationListComponent,
    data: { roles: ['DOCTOR', 'NURSE', 'PATIENT'] }
  },
  {
    path: 'tracking',
    component: IntakeTrackingComponent,
    data: { roles: ['PATIENT', 'NURSE'] }
  },
  {
    path: 'reminders',
    component: ReminderListComponent,
    data: { roles: ['PATIENT', 'NURSE'] }
  },
  {
    path: 'reports',
    component: AdherenceReportComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservanceRoutingModule { }