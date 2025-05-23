import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import colors from '../../components/ColorTamp';
import { db } from '../../firebaseConfig';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DoctorList = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch All Doctors form firestore and favorite from AsyncStorage
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const favoritesJSON = await AsyncStorage.getItem('favoriteDoctors');
        const favoriteIds = favoritesJSON ? JSON.parse(favoritesJSON) : [];
  
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const fetchedDoctors = querySnapshot.docs.map(doc => ({
          id: doc.id,
          isFavorite: favoriteIds.includes(doc.id),
          ...doc.data(),
        }));
        setDoctors(fetchedDoctors);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      }
    };
  
    fetchDoctors();
  }, []);
  
  

  const handleDoctorClick = (doctor) => {
    router.push({
      pathname: "/doctor/contactDetails",
      params: { id: doctor.id, Name: doctor.Name },
    });
    
  };

  // Favorite doctor 
  const toggleFavorite = async (id) => {
    try {
      const updatedDoctors = doctors.map(doctor =>
        doctor.id === id ? { ...doctor, isFavorite: !doctor.isFavorite } : doctor
      );
      setDoctors(updatedDoctors);
  
      // Save favorite IDs only
      const favoriteIds = updatedDoctors.filter(doc => doc.isFavorite).map(doc => doc.id);
      await AsyncStorage.setItem('favoriteDoctors', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.Name.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteDoctors = filteredDoctors.filter(doctor => doctor.isFavorite);
  const otherDoctors = filteredDoctors.filter(doctor => !doctor.isFavorite).sort((a, b) => a.Name.localeCompare(b.name));

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.doctorItem} onPress={() => handleDoctorClick(item)}>
      <Text style={styles.doctorName}>{item.Name}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <AntDesign
          name={item.isFavorite ? 'star' : 'staro'}
          size={24}
          color={item.isFavorite ? colors.primary : 'gray'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <Feather name="search" size={20} color={'gray'} />
        </View>
        <TextInput
          placeholder="Search for doctors..."
          value={search}
          onChangeText={value => setSearch(value)}
          style={styles.searchInput}
          placeholderTextColor="gray"
        />
        {search && (
          <Pressable style={styles.closeIcon} onPress={() => setSearch('')}>
            <Ionicons name="close" size={20} color={'black'} />
          </Pressable>
        )}
      </View>
  
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Favorites Section */}
        {favoriteDoctors.length > 0 && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            {favoriteDoctors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.doctorItem}
                onPress={() => handleDoctorClick(item)}
              >
                <Text style={styles.doctorName}>{item.Name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <AntDesign
                    name={item.isFavorite ? 'star' : 'staro'}
                    size={24}
                    color={item.isFavorite ? colors.primary : 'gray'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
  
        {/* All Doctors Section */}
        {otherDoctors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Doctors</Text>
            {otherDoctors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.doctorItem}
                onPress={() => handleDoctorClick(item)}
              >
                <Text style={styles.doctorName}>{item.Name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <AntDesign
                    name={item.isFavorite ? 'star' : 'staro'}
                    size={24}
                    color={item.isFavorite ? colors.primary : 'gray'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
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
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3, 
  },
  doctorName: {
    fontSize: 16,
    color: '#333',
  },
});
