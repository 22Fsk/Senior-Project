import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Clipboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { FlatList } from 'react-native';
import colors from '../../components/ColorTamp';

const DoctorDetails = () => {
  const { id, name } = useLocalSearchParams(); // Get passed doctor data

  if (!id || !name) {
    return <Text>No doctor information available</Text>;
  }

  const doctorEmail = 'JaneSmith@uob.bh';
  const doctorLocation = '2051, University Building';
  const doctorSchedule = 'See Schedule'; // Example schedule

  const copyToClipboard = async () => {
    await Clipboard.setString(doctorEmail);
    alert('Email copied to clipboard!');
    setTimeout(() => setCopyIconColor(colors.primary), 200); // Reset color after 1 second
  };

  const openLocation = () => {
    alert('Clicked location!');
  };

  const openSchedule = () => {
    alert('Clicked schedule!');
  };

  const [copyIconColor, setCopyIconColor] = useState('gray'); // Set initial color

  // Doctor details data
  const doctorDetails = [
    { label: 'Email', value: doctorEmail, isEmail: true },
    { label: 'Department', value: 'Computer Science' },
    { label: 'Office', value: doctorLocation, isLocation: true },
    { label: 'Schedule', value: doctorSchedule, isSchedule: true },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image
        source={require('../../assets/images/welcome.png')} // Replace with the actual image URL
        style={styles.profileImage}
      />

      <Text style={styles.title}>{name}</Text>

      {/* Doctor Details List */}
      <FlatList
        data={doctorDetails}
        renderItem={({ item }) => (
          <View style={styles.detailItem}>
            <Text style={styles.label}>{item.label}</Text> {/* Title above the box */}
            <View style={styles.detailBox}>
              {item.isEmail ? (
                <View style={styles.row}>
                  <Text style={styles.value}>{item.value}</Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <MaterialIcons name="content-copy" size={20} color={copyIconColor} />
                  </TouchableOpacity>
                </View>
              ) : item.isLocation ? (
                <TouchableOpacity onPress={openLocation}>
                  <Text style={styles.value}>{item.value}</Text>
                </TouchableOpacity>
              ) : item.isSchedule ? (
                <TouchableOpacity onPress={openSchedule} style={styles.row}>
                  <Text style={styles.schedule}>{item.value}</Text>
                  <Entypo name="chevron-right" size={20} color={colors.primary} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.value}>{item.value}</Text>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.label}
      />
    </View>
  );
};

export default DoctorDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Circular image
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, // Space between label and value
    marginLeft: 2,
  },
  detailItem: {
    marginVertical: 10,
  },
  detailBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
    marginHorizontal: 2,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  schedule: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add space between value and icon
  },
});
