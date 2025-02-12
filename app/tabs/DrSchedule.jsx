import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import colors from '../../components/ColorTamp';

const DoctorList = () => {
  // Example doctor data
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. John Doe', isFavorite: false },
    { id: '2', name: 'Dr. Jane Smith', isFavorite: false },
    { id: '3', name: 'Dr. Sarah Johnson', isFavorite: false },
    // Add more doctors as needed
  ]);
  const [search, setSearch] = useState('');

  const toggleFavorite = (id) => {
    setDoctors(prevDoctors => 
      prevDoctors.map(doctor => 
        doctor.id === id ? { ...doctor, isFavorite: !doctor.isFavorite } : doctor
      )
    );
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteDoctors = filteredDoctors.filter(doctor => doctor.isFavorite);
  const otherDoctors = filteredDoctors.filter(doctor => !doctor.isFavorite).sort((a, b) => a.name.localeCompare(b.name));

  const handleDoctorClick = (doctor) => {
    // Handle the click on the doctor's name (e.g., navigate to a detailed page)
    alert(`Clicked on ${doctor.name}`); // Replace this with your desired action (navigation, etc.)
  };

  const renderItem = ({ item }) => (
    <View style={styles.doctorItem}>
      <TouchableOpacity onPress={() => handleDoctorClick(item)}>
        <Text style={styles.doctorName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <AntDesign 
          name={item.isFavorite ? 'star' : 'staro'} 
          size={24} 
          color={item.isFavorite ? colors.primary : 'gray'} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/** Search Bar */}
      <View style={styles.searchBar}>
              <View style={styles.searchIcon}>
                <Feather name="search" size={20} color={'gray'} />
              </View>
              <TextInput
                placeholder='Search for facilities...'
                value={search}
                onChangeText={value => setSearch(value)}
                style={styles.searchInput}
                placeholderTextColor="gray"
              />
              {search && (
                <Pressable style={styles.closeIcon}
                onPress={() => setSearch('')}>
                  <Ionicons name="close" size={20} color={'black'} />
                </Pressable>
              )}
        </View>

      {/* Favorites Section */}
      {favoriteDoctors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <FlatList
            data={favoriteDoctors}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* All Doctors Section */}
      {otherDoctors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Doctors</Text>
          <FlatList
            data={otherDoctors}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    marginBottom:10,
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginHorizontal: 4,
    marginTop: 10,
    padding: 4,
    paddingLeft: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Horizontal and vertical shadow positioning
    shadowOpacity: 0.1, // Adjust for subtle effect
    shadowRadius: 4, // Blur radius
    elevation: 3, // Needed for Android
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 15,
  },
  closeIcon: {
    backgroundColor: 'lightgray',
    padding: 1,
    borderRadius: 20,
    marginRight: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    marginTop: 10,
  },
  doctorItem: {
    marginBottom:4,
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginHorizontal: 4,
    marginTop: 10,
    padding: 15,
    paddingLeft: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Horizontal and vertical shadow positioning
    shadowOpacity: 0.1, // Adjust for subtle effect
    shadowRadius: 4, // Blur radius
    elevation: 3, // Needed for Android
  },
  doctorName: {
    fontSize: 16,
    color: '#333',
  },
});
