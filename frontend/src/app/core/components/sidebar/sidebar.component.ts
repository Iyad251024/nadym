import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  menuSections: MenuSection[] = [
    {
      title: 'Tableau de bord',
      items: [
        { label: 'Accueil', icon: 'dashboard', route: '/dashboard' }
      ]
    },
    {
      title: 'Gestion des patients',
      items: [
        { label: 'Patients', icon: 'people', route: '/patients', roles: ['DOCTOR', 'NURSE'] },
        { label: 'Rendez-vous', icon: 'event', route: '/appointments', roles: ['DOCTOR', 'NURSE'] },
        { label: 'Prescriptions', icon: 'receipt', route: '/patients/prescriptions', roles: ['DOCTOR'] }
      ]
    },
    {
      title: 'Observance',
      items: [
        { label: 'Suivi médicaments', icon: 'medication', route: '/observance', roles: ['DOCTOR', 'NURSE', 'PATIENT'] },
        { label: 'Rappels', icon: 'notifications', route: '/observance/reminders', roles: ['NURSE', 'PATIENT'] }
      ]
    },
    {
      title: 'Télémédecine',
      items: [
        { label: 'Consultations', icon: 'video_call', route: '/telemedicine', roles: ['DOCTOR', 'PATIENT'] },
        { label: 'Messages', icon: 'chat', route: '/telemedicine/messages', roles: ['DOCTOR', 'NURSE', 'PATIENT'] }
      ]
    },
    {
      title: 'Expertise',
      items: [
        { label: 'Téléexpertise', icon: 'psychology', route: '/teleexpertise', roles: ['DOCTOR'] },
        { label: 'RCP', icon: 'groups', route: '/rcp', roles: ['DOCTOR'] },
        { label: 'DCC', icon: 'folder_shared', route: '/dcc', roles: ['DOCTOR', 'NURSE'] }
      ]
    },
    {
      title: 'Outils',
      items: [
        { label: 'Transcription IA', icon: 'transcribe', route: '/transcription', roles: ['DOCTOR'] }
      ]
    }
  ];

  userRoles: string[] = [];

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.userRoles = this.keycloakService.getUserRoles();
  }

  hasAccess(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.some(role => this.userRoles.includes(role));
  }
}