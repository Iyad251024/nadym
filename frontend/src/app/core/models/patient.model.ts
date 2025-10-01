export interface Patient {
  id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address?: string;
  medical_history?: string;
  allergies?: string;
  blood_type?: string;
  insurance_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id?: string;
  patient_id: string;
  doctor_id: number;
  appointment_date: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type?: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'TELEMEDICINE' | 'VACCINATION';
  reason?: string;
  notes?: string;
  duration_minutes?: number;
  created_at?: string;
  updated_at?: string;
  patient?: Patient;
}

export interface Prescription {
  id?: string;
  patient_id: string;
  doctor_id: number;
  prescription_date: string;
  diagnosis: string;
  notes?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  created_at?: string;
  updated_at?: string;
  items?: PrescriptionItem[];
  patient?: Patient;
}

export interface PrescriptionItem {
  id?: string;
  prescription_id: string;
  medication_name: string;
  medication_code?: string;
  dosage: string;
  frequency: string;
  duration_days?: number;
  quantity?: number;
  instructions?: string;
  side_effects?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientStatistics {
  totalPatients: number;
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  activePrescriptions: number;
  appointmentsByType: { type: string; count: number }[];
  appointmentsByStatus: { status: string; count: number }[];
  recentPatients: Patient[];
}
