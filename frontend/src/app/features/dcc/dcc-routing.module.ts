import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DccListComponent } from './components/dcc-list/dcc-list.component';
import { DccDetailComponent } from './components/dcc-detail/dcc-detail.component';
import { DccFormComponent } from './components/dcc-form/dcc-form.component';

const routes: Routes = [
  {
    path: '',
    component: DccListComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: 'new',
    component: DccFormComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id',
    component: DccDetailComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: ':id/edit',
    component: DccFormComponent,
    data: { roles: ['DOCTOR'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DccRoutingModule { }