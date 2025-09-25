# NadyM – Plateforme Web Médicale

**NadyM** est une application web médicale complète pour la gestion des dossiers patients, prescriptions, observance, téléconsultations, téléexpertise, e-RCP, suivi DCC et transcription IA des consultations.  

---

## 🏗 Architecture

- **Backend (Java Spring Boot – Microservices)**  
  - `patient-service` : dossier patient, rendez-vous, prescriptions  
  - `observance-service` : suivi prises, rappels  
  - `telemedicine-service` : vidéo WebRTC, chat, stockage médias  
  - `teleexpertise-service` : demandes d’avis spécialisés  
  - `rcp-service` : réunions pluridisciplinaires digitalisées  
  - `dcc-service` : suivi patients chroniques (DCC)  
  - `transcription-service` : transcription IA via OpenAI API  
  - `interoperability-service` : APIs HL7 / FHIR  
  - `security-service` : auth Keycloak, audit, chiffrement  
  - `common` : librairies partagées  

- **Frontend (Angular)**  
  - Module par domaine médical (patient, observance, télémedecine, téléexpertise, RCP, DCC, transcription)  
  - Core : services globaux, interceptors, auth  
  - Shared : composants réutilisables (header, sidebar, forms, tables)  
  - Design system accessible et ergonomique pour personnel non technique  

- **Base de données** : PostgreSQL  
- **Auth & sécurité** : Keycloak (médecin, infirmier, patient)  
- **Documentation API** : Swagger/OpenAPI  
- **Conteneurisation** : Docker Compose (backend + frontend + Keycloak + Postgres)  

---
\n
