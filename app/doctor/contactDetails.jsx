import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import colors from '../../components/ColorTamp';

const DoctorDetails = () => {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [copyIconColor, setCopyIconColor] = useState('gray');

  if (!id || !name) return <Text>No doctor information available</Text>;

  const doctorDetails = [
    { label: 'Email', value: 'JaneSmith@uob.bh', isEmail: true },
    { label: 'Department', value: 'Computer Science' },
    { label: 'Office', value: 'S40-2051', isLocation: true },
    { label: 'Schedule', value: 'See Schedule', isSchedule: true },
  ];

  const copyToClipboard = async () => {
    await Clipboard.setString(doctorDetails[0].value);
    alert('Email copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/welcome.png')} style={styles.profileImage} />
      <Text style={styles.title}>{name}</Text>
      <FlatList
        data={doctorDetails}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.detailItem}>
            <Text style={styles.label}>{item.label}</Text>
            <TouchableOpacity
              style={styles.detailBox}
              onPress={() => item.isSchedule ? router.push(`/doctor/schedule?id=${id}`) : null}>
              <View style={styles.row}>
                <Text style={item.isSchedule ? styles.schedule : styles.value}>{item.value}</Text>
                {item.isEmail && (
                  <MaterialIcons name="content-copy" size={20} color={copyIconColor} onPress={copyToClipboard} />
                )}
                {(item.isLocation || item.isSchedule) && (
                  <Entypo name="chevron-right" size={20} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  profileImage: { width: 125, height: 125, borderRadius: 60, alignSelf: 'center', marginBottom: 20, borderColor: colors.primary, borderWidth: 5 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 15, fontWeight: 'bold', marginBottom: 5, marginLeft: 2 },
  detailItem: { marginVertical: 10 },
  detailBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  value: { fontSize: 16, color: '#555' },
  schedule: { fontSize: 16, color: colors.primary, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default DoctorDetails;
