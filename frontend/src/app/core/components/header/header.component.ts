import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  userProfile: any;
  userRoles: string[] = [];

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.userProfile = await this.keycloakService.loadUserProfile();
    this.userRoles = this.keycloakService.getUserRoles();
  }

  logout() {
    this.keycloakService.logout();
  }

  getUserRole(): string {
    if (this.userRoles.includes('DOCTOR')) return 'Médecin';
    if (this.userRoles.includes('NURSE')) return 'Infirmier(ère)';
    if (this.userRoles.includes('PATIENT')) return 'Patient';
    return 'Utilisateur';
  }
}