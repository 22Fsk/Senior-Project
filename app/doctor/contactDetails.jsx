import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import colors from '../../components/ColorTamp';
import { useEffect } from 'react';
import {doc , getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import {getProfileImage} from '../../components/getImage';

const DoctorDetails = () => {
  const { id, Name } = useLocalSearchParams();
  const router = useRouter();
  const [copyIconColor, setCopyIconColor] = useState('gray');
  const [doctorData, setDoctorData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!id || !Name) return <Text>No doctor information available</Text>;
  // fetch doctors details from firestorage with id
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctorData(docSnap.data());
        } else {
          console.warn('No such doctor!');
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    if (id) fetchDoctorDetails();
  }, [id, Name]);

  const doctorDetails = doctorData ? [
    { label: 'Email', value: doctorData.Email, isEmail: true },
    { label: 'Department', value: doctorData.Department },
    { label: 'Office', value: doctorData.Office, isLocation: true },
    { label: 'Schedule', value: 'See Schedule', isSchedule: true },
  ] : [];

  if (!doctorData) return <Text style={{ padding: 20 }}>Loading doctor details...</Text>;


  const copyToClipboard = async () => {
    await Clipboard.setString(doctorDetails[0].value);
    setCopied(true);
    alert('Email copied to clipboard!');
  };

  const handleOfficeClick = (officeName) => {
    // Go to the map page with the office number
    router.push(`/mappage?office=${encodeURIComponent(officeName)}`);
  };

  return (
    <View style={styles.container}>
      <Image source={getProfileImage(doctorData.pic?.toString())} style={styles.profileImage} />
      <Text style={styles.title}>{Name}</Text>
      <FlatList
        data={doctorDetails}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.detailItem}>
            <Text style={styles.label}>{item.label}</Text>
            <TouchableOpacity
              style={styles.detailBox}
              onPress={() => item.isLocation 
                ? handleOfficeClick(item.value) 
                : item.isSchedule 
                  ? router.push(`/doctor/schedule?id=${id}`) 
                  : null
              }>
              <View style={styles.row}>
                <Text style={item.isSchedule ? styles.schedule : styles.value}>{item.value}</Text>
                {item.isEmail && (
                  copied ? (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  ) : (
                    <MaterialIcons
                      name="content-copy"
                      size={20}
                      color={copyIconColor}
                      onPress={copyToClipboard}
                    />
                  )
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
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  profileImage: { 
    width: 125, 
    height: 125, 
    borderRadius: 60, 
    alignSelf: 'center', 
    marginBottom: 20, 
    borderColor: colors.primary, 
    borderWidth: 5 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  label: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    marginLeft: 2 
  },
  detailItem: { 
    marginVertical: 10 
  },
  detailBox: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
    elevation: 2 
  },
  value: { 
    fontSize: 16, 
    color: '#555' 
  },
  schedule: { 
    fontSize: 16, 
    color: colors.primary, 
    fontWeight: 'bold' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' },
});

export default DoctorDetails;
