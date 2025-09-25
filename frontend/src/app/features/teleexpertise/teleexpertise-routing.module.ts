import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertiseRequestListComponent } from './components/expertise-request-list/expertise-request-list.component';
import { ExpertiseRequestFormComponent } from './components/expertise-request-form/expertise-request-form.component';
import { ExpertiseResponseComponent } from './components/expertise-response/expertise-response.component';

const routes: Routes = [
  {
    path: '',
    component: ExpertiseRequestListComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: 'new',
    component: ExpertiseRequestFormComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id/response',
    component: ExpertiseResponseComponent,
    data: { roles: ['DOCTOR'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeleexpertiseRoutingModule { }