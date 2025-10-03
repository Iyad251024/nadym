import { Component, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../patient-service';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'name', 'email', 'phone', 'age', 'address', 'actions'];
  dataSource = new MatTableDataSource<Patient>();
  loading = false;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private patientService: PatientService
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
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.dataSource.data = patients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.snackBar.open('Erreur lors du chargement des patients', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
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
    if (confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patient.first_name} ${patient.last_name} ?`)) {
      this.patientService.deletePatient(patient.id!).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Patient supprimé avec succès', 'Fermer', {
              duration: 3000
            });
            this.loadPatients();
          }
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  addPatient() {
    this.router.navigate(['/patients/new']);
  }
}