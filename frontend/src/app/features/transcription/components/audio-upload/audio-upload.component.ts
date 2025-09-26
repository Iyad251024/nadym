import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Patient {
  id: number;
  name: string;
  age: number;
}

@Component({
  selector: 'app-audio-upload',
  templateUrl: './audio-upload.component.html',
  styleUrls: ['./audio-upload.component.scss']
})
export class AudioUploadComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isRecording = false;
  recordingDuration = 0;
  uploadProgress = 0;
  loading = false;
  
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  recordingTimer: any;

  patients: Patient[] = [
    { id: 1, name: 'Marie Dupont', age: 67 },
    { id: 2, name: 'Pierre Durand', age: 72 },
    { id: 3, name: 'Claire Moreau', age: 58 }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.createForm();
  }

  ngOnInit() {
    // Set default values
    this.uploadForm.patchValue({
      consultationDate: new Date().toISOString().split('T')[0],
      consultationType: 'routine',
      language: 'fr',
      autoStructure: true,
      generateSummary: true,
      extractFindings: true
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', [Validators.required]],
      consultationDate: ['', [Validators.required]],
      consultationType: ['', [Validators.required]],
      language: ['', [Validators.required]],
      notes: [''],
      autoStructure: [true],
      generateSummary: [true],
      extractFindings: [true]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/mpeg'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Format de fichier non supporté', 'Fermer', {
          duration: 3000
        });
        return;
      }
      
      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        this.snackBar.open('Fichier trop volumineux (max 100MB)', 'Fermer', {
          duration: 3000
        });
        return;
      }
      
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.recordedChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
        const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
        this.selectedFile = file;
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingDuration = 0;
      
      // Start timer
      this.recordingTimer = setInterval(() => {
        this.recordingDuration++;
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      this.snackBar.open('Erreur d\'accès au microphone', 'Fermer', {
        duration: 3000
      });
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
      }
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.loading = true;
      this.uploadProgress = 0;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        this.uploadProgress += Math.random() * 15;
        
        if (this.uploadProgress >= 100) {
          this.uploadProgress = 100;
          clearInterval(progressInterval);
          
          setTimeout(() => {
            this.loading = false;
            this.snackBar.open('Transcription lancée avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/transcription']);
          }, 1000);
        }
      }, 500);
    } else {
      this.markFormGroupTouched();
      
      if (!this.selectedFile) {
        this.snackBar.open('Veuillez sélectionner un fichier audio', 'Fermer', {
          duration: 3000
        });
      }
    }
  }

  onCancel() {
    if (this.isRecording) {
      this.stopRecording();
    }
    this.router.navigate(['/transcription']);
  }

  getSelectedPatient(): Patient | undefined {
    const patientId = this.uploadForm.get('patientId')?.value;
    return this.patients.find(p => p.id === patientId);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private markFormGroupTouched() {
    Object.keys(this.uploadForm.controls).forEach(key => {
      const control = this.uploadForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.uploadForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    return '';
  }
}