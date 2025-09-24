# NadyM – Plateforme Web Médicale

**NadyM** est une application web médicale complète pour la gestion des dossiers patients, prescriptions, observance, téléconsultations, téléexpertise, e-RCP, suivi DCC et transcription IA des consultations.  

## 🚀 Installation et démarrage rapide

### Prérequis
- Docker et Docker Compose
- Node.js 18+ (pour le développement frontend)
- Java 17+ (pour le développement backend)
- Maven 3.8+ (pour le développement backend)

### Configuration initiale

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd nadym
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer le fichier .env avec vos valeurs
   ```

3. **Démarrer l'infrastructure avec Docker**
   ```bash
   # Démarrer tous les services
   docker-compose up -d
   
   # Ou démarrer seulement l'infrastructure (base de données + Keycloak)
   docker-compose up -d postgres keycloak
   ```

4. **Accéder aux services**
   - **Frontend** : http://localhost:4200
   - **API Gateway** : http://localhost:8081
   - **Keycloak Admin** : http://localhost:8080/admin (admin/admin123)
   - **Base de données** : localhost:5432 (nadym/nadym123)

### Comptes de test

Les comptes suivants sont préconfigurés dans Keycloak :

- **Médecin** : doctor@nadym.com / doctor123
- **Infirmier** : nurse@nadym.com / nurse123  
- **Patient** : patient@nadym.com / patient123
- **Admin** : admin@nadym.com / admin123

### Développement local

#### Backend (Java Spring Boot)

```bash
# Compiler le module common
cd backend/common
mvn clean install

# Démarrer un service (exemple: patient-service)
cd ../patient-service
mvn spring-boot:run
```

#### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur http://localhost:4200

## 📋 Services disponibles

### Backend (Microservices)

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8081 | Point d'entrée unique pour tous les services |
| Patient Service | 8082 | Gestion des dossiers patients, RDV, prescriptions |
| Observance Service | 8083 | Suivi des prises médicamenteuses |
| Telemedicine Service | 8084 | Consultations vidéo et chat |
| Teleexpertise Service | 8085 | Demandes d'avis spécialisés |
| RCP Service | 8086 | Réunions pluridisciplinaires |
| DCC Service | 8087 | Suivi patients chroniques |
| Transcription Service | 8088 | Transcription IA des consultations |
| Interoperability Service | 8089 | APIs HL7/FHIR |
| Security Service | 8090 | Audit et chiffrement |

### Documentation API

Chaque service expose sa documentation Swagger :
- http://localhost:808X/swagger-ui.html (remplacer X par le numéro du port)

## 🔧 Configuration avancée

### Keycloak

Le realm `nadym` est automatiquement importé avec :
- 4 rôles : DOCTOR, NURSE, PATIENT, ADMIN
- 2 clients : nadym-frontend (public), nadym-backend (confidentiel)
- Comptes de test préconfigurés

### Base de données

PostgreSQL avec bases séparées par service pour l'isolation des données.

### Sécurité

- Authentification OAuth2/OIDC via Keycloak
- JWT tokens pour l'autorisation
- RBAC (Role-Based Access Control)
- Audit trail sur toutes les opérations

## 🏗 Architecture détaillée

### Pattern architectural
- **Microservices** : Services métier indépendants
- **API Gateway** : Point d'entrée unique avec routage et authentification
- **Event-driven** : Communication asynchrone entre services
- **CQRS** : Séparation lecture/écriture pour les opérations complexes

### Technologies utilisées
- **Backend** : Java 17, Spring Boot 3.1, Spring Security, Spring Data JPA
- **Frontend** : Angular 16, Angular Material, RxJS
- **Base de données** : PostgreSQL 15
- **Authentification** : Keycloak 22
- **Conteneurisation** : Docker, Docker Compose
- **Documentation** : OpenAPI 3, Swagger UI

## 🧪 Tests

```bash
# Tests backend
cd backend/patient-service
mvn test

# Tests frontend
cd frontend
npm test
```

## 📦 Déploiement en production

1. **Construire les images Docker**
   ```bash
   docker-compose build
   ```

2. **Configurer les variables d'environnement de production**
   - Modifier les mots de passe par défaut
   - Configurer les URLs externes
   - Ajouter la clé API OpenAI

3. **Déployer**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔍 Monitoring et logs

Les logs sont centralisés et accessibles via :
```bash
# Voir les logs d'un service
docker-compose logs -f patient-service

# Voir tous les logs
docker-compose logs -f
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

## 🏗 Architecture technique

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

## 🎯 Fonctionnalités principales

### 👨‍⚕️ Pour les médecins
- Gestion complète des dossiers patients
- Prescriptions électroniques
- Téléconsultations sécurisées
- Demandes de téléexpertise
- Organisation de RCP (Réunions de Concertation Pluridisciplinaire)
- Transcription automatique des consultations (IA)
- Suivi des patients chroniques (DCC)

### 👩‍⚕️ Pour les infirmiers
- Consultation des dossiers patients
- Suivi de l'observance médicamenteuse
- Gestion des rappels de prise
- Participation aux téléconsultations
- Suivi des patients chroniques

### 🏥 Pour les patients
- Accès à leur dossier médical
- Suivi de leurs médicaments
- Rappels automatiques de prise
- Téléconsultations avec leur médecin
- Historique des consultations

### 🔧 Fonctionnalités techniques
- Interopérabilité HL7/FHIR
- Chiffrement des données sensibles
- Audit trail complet
- Sauvegarde automatique
- Haute disponibilité
