import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 30,
      textAlign: 'center',
      color: '#7f8c8d',
    },
    header: {
      fontSize: 14,
      marginBottom: 20,
      fontWeight: 'bold',
      color: '#34495e',
      borderBottom: '1px solid #bdc3c7',
      paddingBottom: 5,
    },
    scheduleItem: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottom: '1px solid #ecf0f1',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    label: {
      width: 100,
      fontWeight: 'bold',
      color: '#3498db',
    },
    value: {
      flex: 1,
      color: '#2c3e50',
    },
    status: {
      marginTop: 5,
      padding: 3,
      fontSize: 12,
      backgroundColor: '#f1c40f',
      color: '#fff',
      borderRadius: 3,
      width: 80,
      textAlign: 'center',
    },
    statusConfirmed: {
      backgroundColor: '#2ecc71',
    },
    statusConflict: {
      backgroundColor: '#e74c3c',
    },
  });

const SchedulePDF = ({ schedule, teacherName }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Emploi du temps de Surveillance</Text>
      <Text style={styles.header}>Enseignant: {teacherName}</Text>
      
      {schedule.map((item, index) => (
        <View key={index} style={styles.scheduleItem}>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{item.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Heure:</Text>
            <Text style={styles.value}>{item.startTime} - {item.endTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Salle:</Text>
            <Text style={styles.value}>{item.room}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Matières:</Text>
            <Text style={styles.value}>{item.subjects.join(' / ')}</Text>
          </View>
          {item.coTeacher && (
            <View style={styles.row}>
              <Text style={styles.label}>Collègue:</Text>
              <Text style={styles.value}>{item.coTeacher}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Statut:</Text>
            <Text style={styles.value}>
              {item.status === 'confirmed' ? 'Confirmé' : 
               item.status === 'pending' ? 'En attente' : 'Conflit'}
            </Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default SchedulePDF;