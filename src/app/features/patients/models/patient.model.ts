// src/app/features/patients/models/patient.model.ts
// Modèle Patient conforme FHIR R4

export type Sexe = 'M' | 'F' | 'I' | 'U'; // Male, Female, Indéterminé, Unknown
export type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type StatutPatient = 'actif' | 'inactif' | 'decede' | 'transfere';
export type NiveauUrgence = 'vert' | 'jaune' | 'orange' | 'rouge';

export interface Adresse {
  ligne1: string;
  ligne2?: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export interface Allergie {
  substance: string;
  reaction: string;
  severite: 'legere' | 'moderee' | 'severe';
  dateDeclaration: Date;
}

export interface ConstantesVitales {
  tensionSystolique?: number;   // mmHg
  tensionDiastolique?: number;  // mmHg
  frequenceCardiaque?: number;  // bpm
  temperature?: number;          // Celsius
  saturationO2?: number;         // %
  poids?: number;                // kg
  taille?: number;               // cm
  dateMesure: Date;
}

export interface Patient {
  id: string;                              // UUID interne
  ins: string;                             // Identité Nationale de Santé (NIR)
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: Sexe;
  groupeSanguin?: GroupeSanguin;
  adresse: Adresse;
  telephone: string;
  email?: string;
  medecinTraitantId: string;
  statut: StatutPatient;
  niveauUrgence?: NiveauUrgence;
  allergies: Allergie[];
  antecedents: string[];
  traitementEnCours: string[];
  dernieresConstantes?: ConstantesVitales;
  dateCreation: Date;
  dateDerniereModification: Date;
}

// Types FHIR R4 (pour la communication avec l'API)
export interface FhirPatient {
  resourceType: 'Patient';
  id: string;
  identifier?: Array<{ system: string; value: string }>;
  name?: Array<{ family: string; given: string[] }>;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  telecom?: Array<{ system: string; value: string }>;
  address?: Array<{
    line: string[];
    postalCode: string;
    city: string;
    country: string;
  }>;
  active?: boolean;
}

export interface FhirBundle<T> {
  resourceType: 'Bundle';
  total?: number;
  entry?: Array<{ resource: T }>;
}

// Données de démonstration (fictives)
export const PATIENTS_DEMO: Patient[] = [
  {
    id: '1',
    ins: '1850612075047',
    nom: 'DUPONT',
    prenom: 'Jean',
    dateNaissance: new Date('1985-06-12'),
    sexe: 'M',
    groupeSanguin: 'A+',
    adresse: {
      ligne1: '12 Rue de la Paix',
      codePostal: '75001',
      ville: 'Paris',
      pays: 'France'
    },
    telephone: '06 12 34 56 78',
    email: 'jean.dupont@email.fr',
    medecinTraitantId: 'DR001',
    statut: 'actif',
    niveauUrgence: 'vert',
    allergies: [],
    antecedents: ['Hypertension artérielle', 'Diabète type 2'],
    traitementEnCours: ['Metformine 500mg', 'Ramipril 5mg'],
    dernieresConstantes: {
      tensionSystolique: 138,
      tensionDiastolique: 88,
      frequenceCardiaque: 72,
      temperature: 36.8,
      saturationO2: 98,
      poids: 82,
      taille: 178,
      dateMesure: new Date()
    },
    dateCreation: new Date('2020-01-15'),
    dateDerniereModification: new Date()
  },
  {
    id: '2',
    ins: '2920315044021',
    nom: 'MARTIN',
    prenom: 'Sophie',
    dateNaissance: new Date('1992-03-15'),
    sexe: 'F',
    groupeSanguin: 'O-',
    adresse: {
      ligne1: '45 Avenue des Fleurs',
      codePostal: '69001',
      ville: 'Lyon',
      pays: 'France'
    },
    telephone: '06 98 76 54 32',
    email: 'sophie.martin@email.fr',
    medecinTraitantId: 'DR002',
    statut: 'actif',
    niveauUrgence: 'orange',
    allergies: [
      {
        substance: 'Pénicilline',
        reaction: 'Urticaire généralisée',
        severite: 'severe',
        dateDeclaration: new Date('2019-05-20')
      }
    ],
    antecedents: ['Asthme', 'Allergie pénicilline'],
    traitementEnCours: ['Ventoline spray', 'Symbicort 200/6'],
    dernieresConstantes: {
      tensionSystolique: 122,
      tensionDiastolique: 78,
      frequenceCardiaque: 88,
      temperature: 37.2,
      saturationO2: 94,
      poids: 65,
      taille: 165,
      dateMesure: new Date()
    },
    dateCreation: new Date('2021-07-08'),
    dateDerniereModification: new Date()
  },
  {
    id: '3',
    ins: '1560819034512',
    nom: 'BERNARD',
    prenom: 'Michel',
    dateNaissance: new Date('1956-08-19'),
    sexe: 'M',
    groupeSanguin: 'B+',
    adresse: {
      ligne1: '8 Impasse du Moulin',
      codePostal: '31000',
      ville: 'Toulouse',
      pays: 'France'
    },
    telephone: '05 61 23 45 67',
    medecinTraitantId: 'DR001',
    statut: 'actif',
    niveauUrgence: 'rouge',
    allergies: [
      {
        substance: 'Aspirine',
        reaction: 'Bronchospasme',
        severite: 'severe',
        dateDeclaration: new Date('2015-03-10')
      },
      {
        substance: 'Sulfamides',
        reaction: 'Éruption cutanée',
        severite: 'moderee',
        dateDeclaration: new Date('2018-11-22')
      }
    ],
    antecedents: ['BPCO', 'Cardiopathie ischémique', 'HTA', 'Tabagisme sevré'],
    traitementEnCours: ['Bisoprolol 5mg', 'Aspirine 75mg', 'Atorvastatine 40mg', 'Spiriva'],
    dernieresConstantes: {
      tensionSystolique: 185,
      tensionDiastolique: 110,
      frequenceCardiaque: 96,
      temperature: 38.1,
      saturationO2: 88,
      poids: 91,
      taille: 172,
      dateMesure: new Date()
    },
    dateCreation: new Date('2018-03-22'),
    dateDerniereModification: new Date()
  },
  {
    id: '4',
    ins: '2780422056789',
    nom: 'LEROY',
    prenom: 'Marie-Claire',
    dateNaissance: new Date('1978-04-22'),
    sexe: 'F',
    groupeSanguin: 'AB+',
    adresse: {
      ligne1: '23 Rue Victor Hugo',
      codePostal: '13001',
      ville: 'Marseille',
      pays: 'France'
    },
    telephone: '04 91 23 45 67',
    email: 'mclaire.leroy@email.fr',
    medecinTraitantId: 'DR003',
    statut: 'actif',
    niveauUrgence: 'jaune',
    allergies: [],
    antecedents: ['Migraine chronique', 'Anxiété généralisée'],
    traitementEnCours: ['Topiramate 100mg', 'Escitalopram 10mg'],
    dernieresConstantes: {
      tensionSystolique: 128,
      tensionDiastolique: 82,
      frequenceCardiaque: 76,
      temperature: 36.9,
      saturationO2: 99,
      poids: 68,
      taille: 162,
      dateMesure: new Date()
    },
    dateCreation: new Date('2022-09-14'),
    dateDerniereModification: new Date()
  }
];
