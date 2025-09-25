import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranscriptionListComponent } from './components/transcription-list/transcription-list.component';
import { TranscriptionDetailComponent } from './components/transcription-detail/transcription-detail.component';
import { AudioUploadComponent } from './components/audio-upload/audio-upload.component';

const routes: Routes = [
  {
    path: '',
    component: TranscriptionListComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: 'upload',
    component: AudioUploadComponent,
    data: { roles: ['DOCTOR'] }
  },
  {
    path: ':id',
    component: TranscriptionDetailComponent,
    data: { roles: ['DOCTOR'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranscriptionRoutingModule { }