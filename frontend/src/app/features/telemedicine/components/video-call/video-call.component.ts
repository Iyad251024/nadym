import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  consultationId: number | null = null;
  isCallActive = false;
  isMuted = false;
  isVideoOff = false;
  isScreenSharing = false;
  callDuration = 0;
  
  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null;
  peerConnection: RTCPeerConnection | null = null;
  
  private callTimer: any;
  private startTime: Date | null = null;

  // Mock consultation data
  consultation = {
    id: 1,
    patientName: 'Marie Dupont',
    doctorName: 'Dr. Jean Martin',
    scheduledTime: '2024-01-20T14:30:00',
    status: 'in_progress'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.consultationId = parseInt(this.route.snapshot.params['id']);
    await this.initializeCall();
  }

  ngOnDestroy() {
    this.endCall();
  }

  async initializeCall() {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (this.localVideo) {
        this.localVideo.nativeElement.srcObject = this.localStream;
      }

      // Initialize WebRTC peer connection
      this.initializePeerConnection();
      
      this.isCallActive = true;
      this.startCallTimer();
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.snackBar.open('Erreur d\'accès à la caméra/microphone', 'Fermer', {
        duration: 5000
      });
    }
  }

  initializePeerConnection() {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.remoteVideo) {
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to remote peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };
  }

  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.isMuted = !audioTrack.enabled;
      }
    }
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.isVideoOff = !videoTrack.enabled;
      }
    }
  }

  async toggleScreenShare() {
    try {
      if (!this.isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = this.peerConnection?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        this.isScreenSharing = true;

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };

      } else {
        this.stopScreenShare();
      }
    } catch (error) {
      console.error('Error with screen sharing:', error);
      this.snackBar.open('Erreur lors du partage d\'écran', 'Fermer', {
        duration: 3000
      });
    }
  }

  async stopScreenShare() {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = this.peerConnection?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      this.isScreenSharing = false;
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  endCall() {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    // Stop timer
    if (this.callTimer) {
      clearInterval(this.callTimer);
    }

    this.isCallActive = false;
    
    // Navigate back to consultations
    this.router.navigate(['/telemedicine']);
    
    this.snackBar.open('Consultation terminée', 'Fermer', {
      duration: 3000
    });
  }

  startCallTimer() {
    this.startTime = new Date();
    this.callTimer = setInterval(() => {
      if (this.startTime) {
        const now = new Date();
        this.callDuration = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
      }
    }, 1000);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  openChat() {
    // Open chat in a dialog or sidebar
    console.log('Opening chat...');
  }

  takeScreenshot() {
    // Capture screenshot for medical records
    console.log('Taking screenshot...');
    this.snackBar.open('Capture d\'écran sauvegardée', 'Fermer', {
      duration: 3000
    });
  }
}