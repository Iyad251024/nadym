import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderType: 'doctor' | 'patient' | 'nurse';
  content: string;
  timestamp: string;
  messageType: 'text' | 'file' | 'image';
  fileName?: string;
  fileUrl?: string;
  isRead: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  messageForm: FormGroup;
  selectedRoom: ChatRoom | null = null;
  
  chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: 'Marie Dupont',
      participants: ['Dr. Martin', 'Marie Dupont'],
      lastMessage: 'Merci pour la consultation',
      lastMessageTime: '2024-01-20T16:30:00',
      unreadCount: 2,
      isActive: true
    },
    {
      id: 2,
      name: 'Pierre Durand',
      participants: ['Dr. Martin', 'Pierre Durand'],
      lastMessage: 'Quand est le prochain RDV ?',
      lastMessageTime: '2024-01-20T14:15:00',
      unreadCount: 0,
      isActive: false
    },
    {
      id: 3,
      name: 'Équipe Cardiologie',
      participants: ['Dr. Martin', 'Dr. Cardio', 'Inf. Sophie'],
      lastMessage: 'Résultats ECG disponibles',
      lastMessageTime: '2024-01-20T11:45:00',
      unreadCount: 1,
      isActive: false
    }
  ];

  messages: ChatMessage[] = [
    {
      id: 1,
      senderId: 1,
      senderName: 'Dr. Martin',
      senderType: 'doctor',
      content: 'Bonjour Marie, comment vous sentez-vous aujourd\'hui ?',
      timestamp: '2024-01-20T14:30:00',
      messageType: 'text',
      isRead: true
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Marie Dupont',
      senderType: 'patient',
      content: 'Bonjour Docteur, je me sens mieux depuis hier. Les douleurs ont diminué.',
      timestamp: '2024-01-20T14:32:00',
      messageType: 'text',
      isRead: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Dr. Martin',
      senderType: 'doctor',
      content: 'Parfait ! Continuez le traitement comme prescrit. Voici vos résultats d\'analyse.',
      timestamp: '2024-01-20T14:35:00',
      messageType: 'file',
      fileName: 'resultats_analyse.pdf',
      fileUrl: '#',
      isRead: true
    },
    {
      id: 4,
      senderId: 2,
      senderName: 'Marie Dupont',
      senderType: 'patient',
      content: 'Merci pour la consultation',
      timestamp: '2024-01-20T16:30:00',
      messageType: 'text',
      isRead: false
    }
  ];

  currentUserId = 1; // Mock current user (doctor)
  loading = false;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.selectedRoom = this.chatRooms[0];
    this.loadMessages();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  selectRoom(room: ChatRoom) {
    this.selectedRoom = room;
    room.unreadCount = 0;
    room.isActive = true;
    
    // Deactivate other rooms
    this.chatRooms.forEach(r => {
      if (r.id !== room.id) {
        r.isActive = false;
      }
    });
    
    this.loadMessages();
  }

  sendMessage() {
    if (this.messageForm.valid && this.selectedRoom) {
      const messageContent = this.messageForm.get('message')?.value;
      
      const newMessage: ChatMessage = {
        id: this.messages.length + 1,
        senderId: this.currentUserId,
        senderName: 'Dr. Martin',
        senderType: 'doctor',
        content: messageContent,
        timestamp: new Date().toISOString(),
        messageType: 'text',
        isRead: true
      };
      
      this.messages.push(newMessage);
      this.messageForm.reset();
      
      // Update room last message
      this.selectedRoom.lastMessage = messageContent;
      this.selectedRoom.lastMessageTime = newMessage.timestamp;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.selectedRoom) {
      // Simulate file upload
      const newMessage: ChatMessage = {
        id: this.messages.length + 1,
        senderId: this.currentUserId,
        senderName: 'Dr. Martin',
        senderType: 'doctor',
        content: `Fichier partagé: ${file.name}`,
        timestamp: new Date().toISOString(),
        messageType: 'file',
        fileName: file.name,
        fileUrl: '#',
        isRead: true
      };
      
      this.messages.push(newMessage);
      
      // Update room last message
      this.selectedRoom.lastMessage = `📎 ${file.name}`;
      this.selectedRoom.lastMessageTime = newMessage.timestamp;
    }
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  downloadFile(message: ChatMessage) {
    // Simulate file download
    console.log('Downloading file:', message.fileName);
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  getSenderTypeIcon(type: string): string {
    switch (type) {
      case 'doctor': return 'medical_services';
      case 'patient': return 'person';
      case 'nurse': return 'local_hospital';
      default: return 'person';
    }
  }

  getSenderTypeColor(type: string): string {
    switch (type) {
      case 'doctor': return '#1976d2';
      case 'patient': return '#388e3c';
      case 'nurse': return '#7b1fa2';
      default: return '#666';
    }
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatLastMessageTime(timestamp: string): string {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    
    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}