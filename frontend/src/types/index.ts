export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  grade: string;
  heuresCours: number;
  heuresTp: number;
  heuresTd: number;
  coeff: number;
  surveillance?: number;
}

export interface TeacherFormData {
  name: string;
  email: string;
  department: string;
  grade: string;
  heuresCours: string;
  heuresTd: string;
  heuresTp: string;
  coeff: string;
}

export interface Filiere {
  id: string;
  nom: string;
niveau: string;
  type:string ;
  nbr_students: number;
}

export interface Examen {
  id: string;
  nom: string;
  date:string;
  start_time:string;
  end_time:string;
  filiere:Filiere;
  
 
  enseignant_responsable: Teacher;
}

export interface Room {
  id: string;
  number: number;
  bloc:string;
  
  disponibility: boolean;
  
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

// export interface ExamSchedule {
//   id: string;
//   examId: string;
//   room: Room[];
//   filiere:Filiere[];
//   surveillance: Teacher[];
// }