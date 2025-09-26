import { Component, OnInit } from '@angular/core';

interface AdherenceData {
  patientName: string;
  medicationName: string;
  adherenceRate: number;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  period: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface PatientSummary {
  patientId: number;
  patientName: string;
  overallAdherence: number;
  medications: AdherenceData[];
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

@Component({
  selector: 'app-adherence-report',
  templateUrl: './adherence-report.component.html',
  styleUrls: ['./adherence-report.component.scss']
})
export class AdherenceReportComponent implements OnInit {
  
  patientSummaries: PatientSummary[] = [
    {
      patientId: 1,
      patientName: 'Marie Dupont',
      overallAdherence: 92,
      riskLevel: 'low',
      lastUpdate: '2024-01-20T14:30:00',
      medications: [
        {
          patientName: 'Marie Dupont',
          medicationName: 'Amoxicilline',
          adherenceRate: 95,
          totalDoses: 21,
          takenDoses: 20,
          missedDoses: 1,
          period: '7 derniers jours',
          trend: 'stable'
        },
        {
          patientName: 'Marie Dupont',
          medicationName: 'Paracétamol',
          adherenceRate: 88,
          totalDoses: 14,
          takenDoses: 12,
          missedDoses: 2,
          period: '7 derniers jours',
          trend: 'improving'
        }
      ]
    },
    {
      patientId: 2,
      patientName: 'Pierre Durand',
      overallAdherence: 76,
      riskLevel: 'medium',
      lastUpdate: '2024-01-20T10:15:00',
      medications: [
        {
          patientName: 'Pierre Durand',
          medicationName: 'Metformine',
          adherenceRate: 80,
          totalDoses: 14,
          takenDoses: 11,
          missedDoses: 3,
          period: '7 derniers jours',
          trend: 'declining'
        },
        {
          patientName: 'Pierre Durand',
          medicationName: 'Lisinopril',
          adherenceRate: 71,
          totalDoses: 7,
          takenDoses: 5,
          missedDoses: 2,
          period: '7 derniers jours',
          trend: 'stable'
        }
      ]
    }
  ];

  loading = false;
  selectedPeriod = '7days';
  
  periods = [
    { value: '7days', label: '7 derniers jours' },
    { value: '30days', label: '30 derniers jours' },
    { value: '3months', label: '3 derniers mois' }
  ];

  constructor() {}

  ngOnInit() {
    this.loadAdherenceReports();
  }

  loadAdherenceReports() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  onPeriodChange() {
    this.loadAdherenceReports();
  }

  getAdherenceColor(rate: number): string {
    if (rate >= 90) return 'primary';
    if (rate >= 70) return 'accent';
    return 'warn';
  }

  getRiskLevelColor(risk: string): string {
    switch (risk) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      default: return 'primary';
    }
  }

  getRiskLevelLabel(risk: string): string {
    switch (risk) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return risk;
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'improving': return 'trending_up';
      case 'stable': return 'trending_flat';
      case 'declining': return 'trending_down';
      default: return 'help';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'improving': return 'primary';
      case 'stable': return 'accent';
      case 'declining': return 'warn';
      default: return 'primary';
    }
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

  exportReport() {
    // Simulate export functionality
    console.log('Exporting adherence report...');
  }
}