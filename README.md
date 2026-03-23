# 🏥 SGP Medical — Système de Gestion de Patients

> Projet Angular 101 — Atelier pratique 4 heures par **Sabri BARBARIA**  
> Application médicale de démonstration construite avec Angular 17

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ LTS
- npm 9+
- Angular CLI 17 : `npm install -g @angular/cli`

### Installation
```bash
git clone <votre-repo>
cd sgp-medical
npm install
ng serve --open
```

L'application est disponible sur **http://localhost:4200**

---

## 📁 Architecture du projet

```
sgp-medical/src/app/
├── core/                          # Singleton — chargé une seule fois
│   ├── services/
│   │   ├── auth.service.ts        # Authentification & gestion des rôles
│   │   ├── audit.service.ts       # Journalisation (obligation HDS/RGPD)
│   │   └── notification.service.ts # Alertes médicales temps réel
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Injection token JWT
│   │   └── audit.interceptor.ts   # Journalisation automatique des appels API
│   └── guards/
│       ├── auth.guard.ts          # Vérification authentification
│       └── role.guard.ts          # Contrôle d'accès RBAC
│
├── shared/                        # Partagé entre toutes les features
│   ├── pipes/
│   │   ├── age.pipe.ts            # Calcul âge depuis date de naissance
│   │   ├── ins-format.pipe.ts     # Formatage Identité Nationale de Santé
│   │   └── cim10.pipe.ts          # Libellé code CIM-10
│   ├── directives/
│   │   ├── sensitive-data.directive.ts   # Masquage données sensibles
│   │   └── role-visibility.directive.ts  # Affichage conditionnel par rôle
│   └── models/
│       └── utilisateur.model.ts   # Types Utilisateur, AuditLog
│
└── features/
    ├── patients/                  # Module lazy-loaded
    │   ├── components/
    │   │   ├── patient-list/      # Liste avec filtres, tri, recherche
    │   │   ├── patient-card/      # Carte récapitulative + @Input/@Output
    │   │   ├── patient-detail/    # Dossier complet avec onglets
    │   │   └── patient-form/      # Formulaire réactif avec validation
    │   ├── services/
    │   │   ├── patient.service.ts     # CRUD + BehaviorSubject (état local)
    │   │   └── patient-api.service.ts # Appels API FHIR R4
    │   └── models/
    │       └── patient.model.ts   # Interfaces Patient, Allergie, etc.
    │
    └── tableau-bord/              # Tableau de bord (eager)
        └── tableau-bord.component.ts
```

---

## 🎓 Concepts Angular couverts

| Module | Concept |
|--------|---------|
| Module 1 | Architecture Angular, comparaison frameworks, standards médicaux |
| Module 2 | Installation CLI, structure projet, commandes ng generate |
| Module 3 | `@Component`, `@Input/@Output`, cycle de vie, `ng-content` |
| Module 4 | Les 4 types de data binding, pipes personnalisés (AgePipe, InsFormatPipe) |
| Module 5 | `*ngIf`, `*ngFor`, `*ngSwitch`, directives d'attribut, directive custom |
| Module 6 | Services, injection de dépendances, BehaviorSubject, RxJS |
| Module 7 | Angular Router, paramètres de route, guards (authGuard, roleGuard) |
| Module 8 | Reactive Forms, FormBuilder, FormArray, validateurs personnalisés |
| Module 9 | HttpClient, FHIR R4, intercepteurs HTTP, gestion d'erreurs |

---

## 🏥 Standards médicaux implémentés

- **FHIR R4** — Mapping Patient ↔ FhirPatient, PatientApiService
- **INS** — Identité Nationale de Santé, pipe de formatage + masquage
- **HDS** — Journalisation de tous les accès (AuditService)
- **RGPD** — Données sensibles masquées par défaut (SensitiveDataDirective)
- **RBAC** — Contrôle d'accès basé sur les rôles (roleGuard)
- **CIM-10** — Pipe de libellé des codes diagnostics
- **CCMU** — Classification des niveaux d'urgence (vert/jaune/orange/rouge)

---

## 🔒 Bonnes pratiques de sécurité

- ❌ Jamais de données sensibles en `localStorage` ou `sessionStorage`
- ✅ Token JWT injecté via intercepteur HTTP (jamais en dur)
- ✅ Journalisation de tous les accès aux dossiers patients
- ✅ Masquage par défaut des données sensibles (INS, email, téléphone)
- ✅ Guards de route par rôle (RBAC)
- ✅ CanDeactivate sur les formulaires non sauvegardés

---

## 🛠️ Commandes utiles

```bash
# Démarrer le serveur de développement
ng serve

# Build de production
ng build --configuration=production

# Tests unitaires avec couverture
ng test --code-coverage

# Analyse statique ESLint
ng lint

# Générer un nouveau composant
ng generate component features/patients/components/mon-composant

# Générer un nouveau service
ng generate service features/patients/services/mon-service
```

---

## 📚 Ressources

| Ressource | URL |
|-----------|-----|
| Documentation Angular | https://angular.dev |
| HL7 FHIR R4 | https://hl7.org/fhir/R4 |
| ANS — Numérique en Santé | https://esante.gouv.fr |
| CNIL Guide Dev RGPD | https://cnil.fr/guides |
| RxJS | https://rxjs.dev |

---

## ⚠️ Avertissement

> Les données patients utilisées dans ce projet sont **entièrement fictives** et ne constituent pas des données médicales réelles. Ce projet est à des fins **pédagogiques uniquement**.

---

*Angular 101 Medical — Sabri BARBARIA — CI-GBM2-TTIS*
