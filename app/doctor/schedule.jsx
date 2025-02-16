import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import colors from '../../components/ColorTamp';

const schedule = () => {
  const { name } = useLocalSearchParams();

  const scheduleData = [
    { day: 'M', start: 9, end: 10 },
    { day: 'T', start: 14, end: 15 },
    { day: 'W', start: 10, end: 11 },
    { day: 'T', start: 15, end: 16 },
    { day: 'S', start: 9.5, end: 10.5 }, // 9:30 to 10:30
    { day: 'W', start: 9.5, end: 10.5 }, // 9:30 to 10:30
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
  const days = ['S', 'M', 'T', 'W', 'H'];

  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    return `${hours}:${minutes === 0 ? '00' : minutes}`;
  };

  const getEvent = (day, hour) => {
    return scheduleData.find((item) => {
      if (item.day === day) {
        if (hour >= item.start && hour < item.end) {
          return true;
        }
        // Check for half-hour intervals
        if (item.start % 1 !== 0 && Math.floor(item.start) === hour) {
          return true;
        }
      }
      return false;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name ? `${name}'s Schedule` : "Doctor's Schedule"}</Text>
      <View style={styles.calendar}>
        <View style={styles.row}>
          <Text style={[styles.timeLabel, styles.timeHeader]}></Text>
          {days.map((day) => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>
        {hours.map((hour) => (
          <View key={hour} style={styles.row}>
            <Text style={[styles.timeLabel, styles.timeCell]}>{formatTime(hour)}</Text>
            {days.map((day) => {
              const event = getEvent(day, hour);
              const isHalfStart = event && event.start % 1 !== 0 && hour === Math.floor(event.start);
              const isHalfEnd = event && event.end % 1 !== 0 && hour === Math.floor(event.end);
              const isFullHourEvent = event && event.start % 1 === 0 && event.end % 1 === 0; // Check for full hour event
              return (
                <View key={`${day}-${hour}`} style={[styles.cell, isFullHourEvent && styles.activeCell]}>
                  {isHalfStart && (
                    <View style={styles.halfCellBottom}>
                      <Text style={styles.halfTimeText}>{formatTime(event.start)}</Text>
                    </View>
                  )}
                  {isHalfEnd && (
                    <View style={styles.halfCellTop}>
                      <Text style={styles.halfTimeText}>{formatTime(event.end)}</Text>
                    </View>
                  )}
                  {isFullHourEvent && (
                    <Text style={styles.eventText}>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  timeLabel: {
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444',
    paddingVertical: 10,
  },
  timeHeader: {
    paddingTop: 0,
  },
  timeCell: {
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 5,
    backgroundColor: '#e0e0e0',
  },
  cell: {
    flex: 1,
    height: 60,
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderRadius: 2,
    position: 'relative',
  },
  activeCell: {
    backgroundColor: colors.primary, // blue color for active event
  },
  halfCellBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the bottom half is on top
    borderRadius: 0
  },
  halfCellTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '60%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure the top half is on top
  },
  halfTimeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default schedule;
