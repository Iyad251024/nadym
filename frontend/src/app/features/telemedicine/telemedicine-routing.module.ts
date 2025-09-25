import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { ChatComponent } from './components/chat/chat.component';
import { ScheduleConsultationComponent } from './components/schedule-consultation/schedule-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationListComponent,
    data: { roles: ['DOCTOR', 'PATIENT'] }
  },
  {
    path: 'schedule',
    component: ScheduleConsultationComponent,
    data: { roles: ['DOCTOR', 'NURSE'] }
  },
  {
    path: 'call/:id',
    component: VideoCallComponent,
    data: { roles: ['DOCTOR', 'PATIENT'] }
  },
  {
    path: 'messages',
    component: ChatComponent,
    data: { roles: ['DOCTOR', 'NURSE', 'PATIENT'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelemedicineRoutingModule { }