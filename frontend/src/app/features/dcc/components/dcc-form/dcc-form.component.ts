import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DccPatient {
  id?: number;
  patientName: string;
  patientAge: number;
  diagnosis: string;
  stage: string;
  treatmentPhase: 'diagnostic' | 'treatment' | 'surveillance' | 'palliative';
  assignedDoctor: string;
  assignedNurse?: string;
  riskLevel: 'low' | 'medium' | 'high';
  medicalHistory: string;
  currentTreatment: string;
  sideEffects?: string;
  notes?: string;
}

@Component({
  selector: 'app-dcc-form',
  templateUrl: './dcc-form.component.html',
  styleUrls: ['./dcc-form.component.scss']
})
export class DccFormComponent implements OnInit {
  
  dccForm: FormGroup;
  isEditMode = false;
  patientId: number | null = null;
  loading = false;

  treatmentPhases = [
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'treatment', label: 'Traitement' },
    { value: 'surveillance', label: 'Surveillance' },
    { value: 'palliative', label: 'Palliatif' }
  ];

  riskLevels = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyen' },
    { value: 'high', label: 'Élevé' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dccForm = this.createForm();
  }

  ngOnInit() {
    this.patientId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.patientId;
    
    if (this.isEditMode) {
      this.loadPatient();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientName: ['', [Validators.required]],
      patientAge: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      diagnosis: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      treatmentPhase: ['', [Validators.required]],
      assignedDoctor: ['', [Validators.required]],
      assignedNurse: [''],
      riskLevel: ['', [Validators.required]],
      medicalHistory: ['', [Validators.required]],
      currentTreatment: ['', [Validators.required]],
      sideEffects: [''],
      notes: ['']
    });
  }

  loadPatient() {
    this.loading = true;
    
    // Mock data - in real app, this would come from a service
    const mockPatient: DccPatient = {
      id: this.patientId!,
      patientName: 'Marie Dupont',
      patientAge: 67,
      diagnosis: 'Cancer du sein',
      stage: 'T2N1M0',
      treatmentPhase: 'treatment',
      assignedDoctor: 'Dr. Martin',
      assignedNurse: 'Inf. Sophie',
      riskLevel: 'medium',
      medicalHistory: 'Antécédents familiaux de cancer du sein. Ménopause à 52 ans.',
      currentTreatment: 'Chimiothérapie adjuvante - Protocole AC-T',
      sideEffects: 'Fatigue modérée, nausées occasionnelles',
      notes: 'Patiente très coopérative. Bonne tolérance au traitement.'
    };
    
    setTimeout(() => {
      this.dccForm.patchValue(mockPatient);
      this.loading = false;
    }, 1000);
  }

  onSubmit() {
    if (this.dccForm.valid) {
      this.loading = true;
      const formData = this.dccForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        const message = this.isEditMode ? 'DCC mis à jour avec succès' : 'DCC créé avec succès';
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
        this.router.navigate(['/dcc']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dcc']);
  }

  private markFormGroupTouched() {
    Object.keys(this.dccForm.controls).forEach(key => {
      const control = this.dccForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dccForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('min')) {
      return 'La valeur doit être positive';
    }
    if (control?.hasError('max')) {
      return 'La valeur est trop élevée';
    }
    return '';
  }
}