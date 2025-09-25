import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RcpListComponent } from './components/rcp-list/rcp-list.component';
import { RcpDetailComponent } from './components/rcp-detail/rcp-detail.component';
import { RcpFormComponent } from './components/rcp-form/rcp-form.component';

const routes: Routes = [
  {
    path: '',
    component: RcpListComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: 'new',
    component: RcpFormComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id',
    component: RcpDetailComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id/edit',
    component: RcpFormComponent,
    data: { roles: ['DOCTOR'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcpRoutingModule { }