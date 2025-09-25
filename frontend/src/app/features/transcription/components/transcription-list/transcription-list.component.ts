import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Transcription {
  id: number;
  consultationId: number;
  patientName: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidenceScore?: number;
  duration?: number;
  hasStructuredNotes: boolean;
  hasSummary: boolean;
}

@Component({
  selector: 'app-transcription-list',
  templateUrl: './transcription-list.component.html',
  styleUrls: ['./transcription-list.component.scss']
})
export class TranscriptionListComponent implements OnInit {
  
  transcriptions: Transcription[] = [
    {
      id: 1,
      consultationId: 101,
      patientName: 'Marie Dupont',
      date: '2024-01-20T14:30:00',
      status: 'completed',
      confidenceScore: 95,
      duration: 25,
      hasStructuredNotes: true,
      hasSummary: true
    },
    {
      id: 2,
      consultationId: 102,
      patientName: 'Pierre Durand',
      date: '2024-01-20T16:00:00',
      status: 'processing',
      duration: 30,
      hasStructuredNotes: false,
      hasSummary: false
    },
    {
      id: 3,
      consultationId: 103,
      patientName: 'Claire Moreau',
      date: '2024-01-19T10:00:00',
      status: 'completed',
      confidenceScore: 88,
      duration: 20,
      hasStructuredNotes: true,
      hasSummary: true
    },
    {
      id: 4,
      consultationId: 104,
      patientName: 'Jean Martin',
      date: '2024-01-19T15:30:00',
      status: 'failed',
      duration: 15,
      hasStructuredNotes: false,
      hasSummary: false
    }
  ];

  loading = false;
  completedTranscriptions: Transcription[] = [];
  processingTranscriptions: Transcription[] = [];
  failedTranscriptions: Transcription[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTranscriptions();
    this.categorizeTranscriptions();
  }

  loadTranscriptions() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  categorizeTranscriptions() {
    this.completedTranscriptions = this.transcriptions.filter(t => t.status === 'completed');
    this.processingTranscriptions = this.transcriptions.filter(t => t.status === 'processing' || t.status === 'pending');
    this.failedTranscriptions = this.transcriptions.filter(t => t.status === 'failed');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'pending': return 'accent';
      case 'failed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  }

  getConfidenceColor(score: number): string {
    if (score >= 90) return 'primary';
    if (score >= 70) return 'accent';
    return 'warn';
  }

  viewTranscription(transcription: Transcription) {
    this.router.navigate(['/transcription', transcription.id]);
  }

  uploadAudio() {
    this.router.navigate(['/transcription/upload']);
  }

  retryTranscription(transcription: Transcription) {
    transcription.status = 'pending';
    this.categorizeTranscriptions();
    // Simulate retry
    setTimeout(() => {
      transcription.status = 'processing';
      this.categorizeTranscriptions();
    }, 1000);
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}