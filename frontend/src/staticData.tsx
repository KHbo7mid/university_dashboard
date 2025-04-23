import { Examen, Filiere, Room, Teacher } from "./types/index";

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sophie Martin',
    department: 'Informatique',
    grade: 'maitre assistant',
    heures_cours: 6,
    heures_td: 3,
    heures_tp: 0,
    coefficient: 0.75,
    surveillance: 7 
  },
  {
    id: '2',
    name: 'Dr. Sophie Martin',
    department: 'Informatique',
    grade: 'maitre assistant',
    heures_cours: 6,
    heures_td: 3,
    heures_tp: 0,
    coefficient: 0.75,
    surveillance: 7 
  }
];

export const mockRooms: Room[] = [
  {
    id: '1',
    number: 6,
    bloc:'K',
   
   disponibility: true,
  },
  {
    id: '2',
    number: 6,
    bloc:'M',
    
    disponibility: true,
   
  },
  {
    id: '3',
    number: 6,
    bloc:'J',
    
    disponibility: true,
   
  }
];

export const mockPrograms: Filiere[] = [
    {
      id: '1',
      name: 'DNI-Informatique-Tronc Commun',
      niveau: 'A1',
      type: 'Cycle d\'Ingénieur',
      nbr_etudiants: 120,
    },
    {
      id: '2',
      name: 'DNI-Informatique-Génie Logiciel',
      niveau: 'A2',
      type: 'Cycle d\'Ingénieur',
      nbr_etudiants: 120,

    }
  ];
  export const mockExamens: Examen[] = [
    {
      id: '1',
      name: 'Algorithmique',
     
      filiere: 'A1 - DNI-Informatique-Tronc Commun',
     date: '2025-10-15',
     start_time:'08:30',
      end_time:'10:00',
      teacher_responsable: 'Dr. Sophie Martin'
    },
    {
      id: '2',
      name: 'Analyse',
    
      filiere: 'A2 - DNI-Informatique-Génie Logiciel',
      date: '2025-10-15',
      start_time:'08:30',
      end_time:'10:00',
      teacher_responsable: 'Prof. Thomas Bernard'
    },
    
  ];
  