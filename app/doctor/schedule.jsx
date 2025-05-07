import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import colors from '../../components/ColorTamp';

const Schedule = () => {
  const { id } = useLocalSearchParams();
  const [schedule, setSchedule] = useState(null);
  const [name, setName] = useState(null); // State to store doctor's name
  const [hour, setHour] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSchedule(data.schedule);
          setHour(data.officehours);
          const fullName = data.Name || '';
          const parts = fullName.split(' ');
          const doctorName = parts.length >= 2
            ? `${parts[0]} ${parts[1]} ${parts[parts.length - 1]}` // e.g., "Dr. Allaqab"
            : fullName;
            
          setName(doctorName); 
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching schedule: ', error);
      }
    };

    fetchSchedule();
  }, [id]);

  const renderScheduleTable = () => {
    if (!schedule) return <Text>Loading schedule...</Text>;
  
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const weekShort = ['U', 'M', 'T', 'W', 'H'];
  
    // Prepare the schedule data for display
    const tableData = daysOfWeek.map(day => schedule[day] || []);
  
    // Get the maximum number of time slots in any day to determine row count
    const maxSlots = Math.max(...tableData.map(times => times.length));
  
    // Generate rows based on the max number of slots
    const rows = [];
    for (let i = 0; i < maxSlots; i++) {
      rows.push(
        <View key={i} style={styles.row}>
          {tableData.map((times, index) => {
            const timeSlot = times[i];  // Get the i-th time slot for each day
            if (timeSlot) {
              const [start, end] = timeSlot.split('-');  // Split start and end time
              return (
                <View key={index} style={styles.cell}>
                  <Text style={styles.cellText}>{start}</Text>
                  <Text style={styles.cellText}>{end}</Text>
                </View>
              );
            }
            return (
              <View key={index} style={styles.cell}>
                <Text style={styles.cellText}>-</Text> 
              </View>
            );
          })}
        </View>
      );
    }
  
    return (
      <View style={styles.table}>
        <View style={styles.row}>
          {weekShort.map((day, index) => (
            <Text key={day} style={styles.headerCell}>{day}</Text>
          ))}
        </View>
        {rows}
      </View>
    );
  };  
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {name ? `${name}` : 'Loading name...'}
      </Text>
      <Text style={styles.hour}>
        <Text style={{ fontWeight: 'bold'}}>Office Hours:</Text>{'\n'}
          {hour}
        </Text>
      <ScrollView>
        {renderScheduleTable()}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 13,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 3,
    backgroundColor: 'rgb(217, 229, 237)',
  },
  headerCell: {
    flex: 1,
    padding: 15,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
    borderRadius: 3,
    margin: 1,
  },
  cellText: {
    fontSize: 13,
    textAlign: 'center',
  },
  hour : {
    backgroundColor: 'rgb(218, 240, 255)',
    padding: 10,
    margin: 1,
    borderRadius: 4,
    color: colors.primary,
    marginTop: 20,
    textAlign: 'center',
  },
  timeSlotCell: {
    marginBottom: 5,  
    padding: 1,
    backgroundColor: 'rgb(217, 229, 237)',  // Or another color that fits the design
    borderRadius: 3,
  },
});

export default Schedule;
