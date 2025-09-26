import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface RcpMeeting {
  id: number;
  title: string;
  patientName: string;
  patientAge: number;
  pathology: string;
  scheduledDate: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingType: 'virtual' | 'physical' | 'hybrid';
  location?: string;
  roomUrl?: string;
  organizer: string;
  participants: RcpParticipant[];
  clinicalSummary: string;
  decisionSummary?: string;
  recommendations?: string;
  nextSteps?: string;
  duration: number;
}

interface RcpParticipant {
  id: number;
  name: string;
  specialty: string;
  role: 'organizer' | 'presenter' | 'participant' | 'observer';
  attendanceStatus: 'invited' | 'confirmed' | 'attended' | 'absent';
  contribution?: string;
}

@Component({
  selector: 'app-rcp-detail',
  templateUrl: './rcp-detail.component.html',
  styleUrls: ['./rcp-detail.component.scss']
})
export class RcpDetailComponent implements OnInit {
  
  meeting: RcpMeeting | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMeeting();
  }

  loadMeeting() {
    this.loading = true;
    const id = parseInt(this.route.snapshot.params['id']);
    
    // Mock data - in real app, this would come from a service
    this.meeting = {
      id: id,
      title: 'RCP Oncologie - Cas complexe',
      patientName: 'Marie Dupont',
      patientAge: 67,
      pathology: 'Cancer du sein métastatique',
      scheduledDate: '2024-01-22T14:00:00',
      actualStartTime: '2024-01-22T14:05:00',
      actualEndTime: '2024-01-22T15:15:00',
      status: 'completed',
      meetingType: 'virtual',
      roomUrl: 'https://meet.nadym.com/rcp-123',
      organizer: 'Dr. Martin',
      duration: 70,
      participants: [
        {
          id: 1,
          name: 'Dr. Jean Martin',
          specialty: 'Oncologie médicale',
          role: 'organizer',
          attendanceStatus: 'attended',
          contribution: 'Présentation du cas, coordination de la discussion'
        },
        {
          id: 2,
          name: 'Dr. Sophie Chirurgie',
          specialty: 'Chirurgie oncologique',
          role: 'participant',
          attendanceStatus: 'attended',
          contribution: 'Avis sur la faisabilité chirurgicale, recommandations techniques'
        },
        {
          id: 3,
          name: 'Dr. Pierre Radio',
          specialty: 'Radiologie',
          role: 'participant',
          attendanceStatus: 'attended',
          contribution: 'Analyse des images, stadification précise'
        },
        {
          id: 4,
          name: 'Dr. Marie Anatomo',
          specialty: 'Anatomopathologie',
          role: 'participant',
          attendanceStatus: 'attended',
          contribution: 'Confirmation histologique, profil moléculaire'
        }
      ],
      clinicalSummary: 'Patiente de 67 ans présentant un cancer du sein T2N1M0, RH+/HER2-. Découverte fortuite lors d\'un dépistage mammographique. Bilan d\'extension négatif. Bon état général, PS=0.',
      decisionSummary: 'Décision collégiale de traitement néoadjuvant par chimiothérapie (protocole AC-T) suivi de chirurgie conservatrice et radiothérapie adjuvante. Hormonothérapie adjuvante par tamoxifène pendant 5 ans.',
      recommendations: 'Chimiothérapie néoadjuvante: 4 cycles AC (Adriamycine-Cyclophosphamide) puis 4 cycles Taxotère\nRéévaluation clinique et radiologique après 4 cycles\nChirurgie conservatrice si bonne réponse\nRadiothérapie adjuvante\nHormonothérapie par Tamoxifène 20mg/j pendant 5 ans',
      nextSteps: 'Consultation d\'annonce avec l\'oncologue dans la semaine\nProgrammation de la chimiothérapie\nConsultation pré-anesthésique\nRDV de suivi dans 3 semaines'
    };
    
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/rcp']);
  }

  editMeeting() {
    this.router.navigate(['/rcp', this.meeting?.id, 'edit']);
  }

  printReport() {
    window.print();
  }

  exportToPdf() {
    // Simulate PDF export
    console.log('Exporting RCP report to PDF...');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'scheduled': return 'Programmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'organizer': return 'Organisateur';
      case 'presenter': return 'Présentateur';
      case 'participant': return 'Participant';
      case 'observer': return 'Observateur';
      default: return role;
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'organizer': return 'primary';
      case 'presenter': return 'accent';
      case 'participant': return 'primary';
      case 'observer': return 'primary';
      default: return 'primary';
    }
  }

  getAttendanceColor(status: string): string {
    switch (status) {
      case 'attended': return 'primary';
      case 'confirmed': return 'accent';
      case 'invited': return 'primary';
      case 'absent': return 'warn';
      default: return 'primary';
    }
  }

  getAttendanceLabel(status: string): string {
    switch (status) {
      case 'attended': return 'Présent';
      case 'confirmed': return 'Confirmé';
      case 'invited': return 'Invité';
      case 'absent': return 'Absent';
      default: return status;
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

  formatRecommendations(recommendations: string): string[] {
    return recommendations.split('\n').filter(line => line.trim());
  }

  formatNextSteps(nextSteps: string): string[] {
    return nextSteps.split('\n').filter(line => line.trim());
  }
}