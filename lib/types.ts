// Employee types
export interface Employee {
  id: number
  nom: string
  prénom: string
  email: string
  téléphone: string
  matricule: string
  structure: string
  password?: string
  role: "admin" | "employee"
}

// Destination types
export interface Destination {
  id: number
  nom: string
  localisation: string
  capacité: number
  type: "externe" | "naftal_interne"
  description: string
}

// Periode types
export interface Periode {
  id: number
  nom: string
  date_debut_periode: string
  date_fin_periode: string
  date_limite_inscription: string
  statut: "open" | "closed"
}

// Session types
export interface Session {
  id: number
  nom: string
  date_debut: string
  date_fin: string
  destination_id: number
  periode_id: number
  destination_nom?: string
  periode_nom?: string
}

// Inscription types
export interface Inscription {
  id: number
  employee_id: number
  session_id: number
  date_inscription: string
  statut: "active" | "cancelled" | "completed"
  employee_name?: string
  session_name?: string
  deadline?: string
}

// Resultat Selection types
export interface ResultatSelection {
  id: number
  session_id: number
  employee_id: number
  type_selection: "officiel" | "suppléant"
  ordre_priorite: number
  date_selection: string
  employee_nom?: string
  employee_prenom?: string
  session_nom?: string
}
