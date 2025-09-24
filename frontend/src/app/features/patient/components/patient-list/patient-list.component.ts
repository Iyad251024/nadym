import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  city: string;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'age', 'city', 'actions'];
  dataSource = new MatTableDataSource<Patient>();
  loading = false;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Mock data - in real app, this would come from a service
  mockPatients: Patient[] = [
    {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      phone: '01 23 45 67 89',
      dateOfBirth: '1985-03-15',
      gender: 'FEMALE',
      city: 'Paris'
    },
    {
      id: 2,
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean.martin@email.com',
      phone: '01 98 76 54 32',
      dateOfBirth: '1978-11-22',
      gender: 'MALE',
      city: 'Lyon'
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: 'sophie.bernard@email.com',
      phone: '01 11 22 33 44',
      dateOfBirth: '1992-07-08',
      gender: 'FEMALE',
      city: 'Marseille'
    }
  ];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.dataSource.data = this.mockPatients;
      this.loading = false;
    }, 1000);
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  viewPatient(patient: Patient) {
    this.router.navigate(['/patients', patient.id]);
  }

  editPatient(patient: Patient) {
    this.router.navigate(['/patients', patient.id, 'edit']);
  }

  deletePatient(patient: Patient) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patient.firstName} ${patient.lastName} ?`)) {
      // Simulate API call
      this.snackBar.open('Patient supprimé avec succès', 'Fermer', {
        duration: 3000
      });
      this.loadPatients();
    }
  }

  addPatient() {
    this.router.navigate(['/patients/new']);
  }
}