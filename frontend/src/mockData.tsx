export default function mockNotifications() {
    return [
      {
        id: '1',
        title: 'Conflit de salle',
        message: 'Salle A101 réservée deux fois le même jour',
        type: 'error',
        date: '2024-03-10T10:00:00',
        read: false
      },
      {
        id: '2',
        title: 'Nouveau message',
        message: 'Prof. Martin a confirmé sa disponibilité',
        type: 'info',
        date: '2024-03-10T09:30:00',
        read: false
      },
      {
        id: '3',
        title: 'Planning confirmé',
        message: 'Planning du département Info validé',
        type: 'success',
        date: '2024-03-10T09:00:00',
        read: true
      }
    ];
  }
  