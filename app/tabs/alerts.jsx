import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useState } from 'react';
import colors from '../../components/ColorTamp';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialAlerts = [
  { id: '1', title: 'Science Fair on Campus', type: 'Event', subscribed: false },
  { id: '2', title: 'Last Day of Next Semester Course Registeration', type: 'Reminder', subscribed: false },
  { id: '3', title: 'University Closed on May 6', type: 'Announcement', subscribed: false },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const toggleSubscription = (id) => {
    const updated = alerts.map((alert) =>
      alert.id === id ? { ...alert, subscribed: !alert.subscribed } : alert
    );
    setAlerts(updated);
  };

  const renderItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertType}>{item.type}</Text>
        </View>
        <Pressable onPress={() => toggleSubscription(item.id)}>
          <Ionicons
            name={item.subscribed ? 'notifications' : 'notifications-outline'}
            size={24}
            color={item.subscribed ? colors.primary : '#6b7280'}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Announcements</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  list: {
    paddingBottom: 20,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertType: {
    fontSize: 14,
    color: '#6b7280',
  },
});
