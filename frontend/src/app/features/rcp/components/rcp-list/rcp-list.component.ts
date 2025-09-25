import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface RcpMeeting {
  id: number;
  title: string;
  patientName: string;
  patientAge: number;
  pathology: string;
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: string[];
  organizer: string;
  location: 'virtual' | 'physical' | 'hybrid';
  duration: number;
  summary?: string;
}

@Component({
  selector: 'app-rcp-list',
  templateUrl: './rcp-list.component.html',
  styleUrls: ['./rcp-list.component.scss']
})
export class RcpListComponent implements OnInit {
  
  rcpMeetings: RcpMeeting[] = [
    {
      id: 1,
      title: 'RCP Oncologie - Cas complexe',
      patientName: 'Marie D.',
      patientAge: 67,
      pathology: 'Cancer du sein métastatique',
      scheduledDate: '2024-01-22T14:00:00',
      status: 'scheduled',
      participants: ['Dr. Martin', 'Dr. Dupont', 'Dr. Bernard', 'Dr. Moreau'],
      organizer: 'Dr. Martin',
      location: 'virtual',
      duration: 60
    },
    {
      id: 2,
      title: 'RCP Cardiologie - Insuffisance cardiaque',
      patientName: 'Pierre L.',
      patientAge: 72,
      pathology: 'Insuffisance cardiaque sévère',
      scheduledDate: '2024-01-21T16:30:00',
      status: 'completed',
      participants: ['Dr. Cardio', 'Dr. Pneumo', 'Dr. Nephro'],
      organizer: 'Dr. Cardio',
      location: 'physical',
      duration: 45,
      summary: 'Décision de mise en place d\'un DAI. Suivi rapproché prévu.'
    },
    {
      id: 3,
      title: 'RCP Neurologie - AVC récent',
      patientName: 'Claire M.',
      patientAge: 58,
      pathology: 'AVC ischémique étendu',
      scheduledDate: '2024-01-20T10:00:00',
      status: 'in_progress',
      participants: ['Dr. Neuro', 'Dr. Rééducation', 'Dr. Psychiatre'],
      organizer: 'Dr. Neuro',
      location: 'hybrid',
      duration: 90
    }
  ];

  loading = false;
  upcomingMeetings: RcpMeeting[] = [];
  activeMeetings: RcpMeeting[] = [];
  completedMeetings: RcpMeeting[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadRcpMeetings();
    this.categorizeMeetings();
  }

  loadRcpMeetings() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  categorizeMeetings() {
    const now = new Date();
    
    this.upcomingMeetings = this.rcpMeetings.filter(m => 
      m.status === 'scheduled' && new Date(m.scheduledDate) > now
    );
    
    this.activeMeetings = this.rcpMeetings.filter(m => 
      m.status === 'in_progress'
    );
    
    this.completedMeetings = this.rcpMeetings.filter(m => 
      m.status === 'completed' || m.status === 'cancelled'
    );
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

  getLocationIcon(location: string): string {
    switch (location) {
      case 'virtual': return 'video_call';
      case 'physical': return 'meeting_room';
      case 'hybrid': return 'hub';
      default: return 'place';
    }
  }

  getLocationLabel(location: string): string {
    switch (location) {
      case 'virtual': return 'Virtuelle';
      case 'physical': return 'Présentielle';
      case 'hybrid': return 'Hybride';
      default: return location;
    }
  }

  newRcp() {
    this.router.navigate(['/rcp/new']);
  }

  viewRcp(meeting: RcpMeeting) {
    this.router.navigate(['/rcp', meeting.id]);
  }

  joinRcp(meeting: RcpMeeting) {
    // Simulate joining RCP
    console.log('Joining RCP:', meeting.title);
  }

  cancelRcp(meeting: RcpMeeting) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette RCP ?')) {
      meeting.status = 'cancelled';
      this.categorizeMeetings();
    }
  }

  canJoin(meeting: RcpMeeting): boolean {
    return meeting.status === 'scheduled' || meeting.status === 'in_progress';
  }

  canCancel(meeting: RcpMeeting): boolean {
    return meeting.status === 'scheduled';
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