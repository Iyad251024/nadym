import { Component, OnInit } from '@angular/core';

interface Reminder {
  id: number;
  medicationName: string;
  dosage: string;
  reminderTime: string;
  frequency: string;
  isActive: boolean;
  lastSent?: string;
  nextReminder: string;
  type: 'medication' | 'refill' | 'appointment';
}

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss']
})
export class ReminderListComponent implements OnInit {
  
  reminders: Reminder[] = [
    {
      id: 1,
      medicationName: 'Amoxicilline',
      dosage: '500mg',
      reminderTime: '08:00',
      frequency: '3 fois par jour',
      isActive: true,
      lastSent: '2024-01-20T08:00:00',
      nextReminder: '2024-01-20T12:00:00',
      type: 'medication'
    },
    {
      id: 2,
      medicationName: 'Paracétamol',
      dosage: '1000mg',
      reminderTime: '12:00',
      frequency: 'Au besoin',
      isActive: false,
      nextReminder: '2024-01-20T12:00:00',
      type: 'medication'
    },
    {
      id: 3,
      medicationName: 'Vitamine D',
      dosage: '1000 UI',
      reminderTime: '20:00',
      frequency: '1 fois par jour',
      isActive: true,
      lastSent: '2024-01-19T20:00:00',
      nextReminder: '2024-01-20T20:00:00',
      type: 'medication'
    }
  ];

  loading = false;

  constructor() {}

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  toggleReminder(reminder: Reminder) {
    reminder.isActive = !reminder.isActive;
    // Simulate API call to update reminder
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'medication': return 'medication';
      case 'refill': return 'shopping_cart';
      case 'appointment': return 'event';
      default: return 'notifications';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'medication': return 'Prise médicament';
      case 'refill': return 'Renouvellement';
      case 'appointment': return 'Rendez-vous';
      default: return type;
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isUpcoming(dateTime: string): boolean {
    const reminderDate = new Date(dateTime);
    const now = new Date();
    const diffHours = (reminderDate.getTime() - now.getTime()) / (1000 * 3600);
    return diffHours <= 2 && diffHours >= 0;
  }

  getActiveRemindersCount(): number {
    return this.reminders.filter(r => r.isActive).length;
  }
}