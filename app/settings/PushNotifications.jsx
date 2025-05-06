import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const PushNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);

    // 🔔 Here you could also request notification permissions
    // or register/unregister from notification service
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#2196F3' : '#f4f3f4'}
        />
      </View>
      <Text style={styles.description}>
        Receive updates about events, schedule changes, and important announcements.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#444',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default PushNotifications;
