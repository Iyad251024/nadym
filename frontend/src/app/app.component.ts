import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NadyM Medical Platform';
  isLoggedIn = false;
  userProfile: any;

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
    }
  }

  logout() {
    this.keycloakService.logout();
  }
}