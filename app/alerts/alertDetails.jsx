import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';  // Import useRoute to get params
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Import Ionicons for the bell icon
import FontAwesome from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome for calendar and clock icons
import colors from '../../components/ColorTamp';  // Assuming you have a colors file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AlertDetail = () => {
  const route = useRoute();  // Access the params passed during navigation
  const { alertId } = route.params;  // Get the alertId passed from the Alerts screen
  const [alertData, setAlertData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      const saved = await AsyncStorage.getItem('bookmarkedEvents');
      const savedArray = saved ? JSON.parse(saved) : [];
      setIsBookmarked(savedArray.includes(alertId));
    };
    checkIfBookmarked();
  }, [alertId]);
  
  const handleBookmark = async () => {
    try {
      const saved = await AsyncStorage.getItem('bookmarkedEvents');
      let savedArray = saved ? JSON.parse(saved) : [];
  
      if (savedArray.includes(alertId)) {
        // Remove the alert from bookmarks
        savedArray = savedArray.filter(id => id !== alertId);
        await AsyncStorage.setItem('bookmarkedEvents', JSON.stringify(savedArray));
        setIsBookmarked(false);
        Alert.alert('Removed', 'Event has been removed from bookmarks.');
      } else {
        // Add the alert to bookmarks
        savedArray.push(alertId);
        await AsyncStorage.setItem('bookmarkedEvents', JSON.stringify(savedArray));
        setIsBookmarked(true);
        Alert.alert('Saved!', 'Event has been added to bookmarks.');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };
  
  

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const docRef = doc(db, 'alerts', alertId); // Get the alert by ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAlertData(docSnap.data()); // Set the alert data into state
        } else {
          console.warn('No such alert!');
        }
      } catch (error) {
        console.error('Error fetching alert details:', error);
      }
    };

    fetchAlertDetails();
  }, [alertId]);

  if (!alertData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}> 
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{alertData.title}</Text>
      </View>

      {/* Highlighted Type */}
      <View style={styles.metaRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{alertData.type}</Text>
        </View>
      </View>

      {/* Message Box */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{alertData.message}</Text>

        {/* Date and Time with Icons */}
        {alertData.date && (
          <View style={styles.dateTimeRow}>
            <FontAwesome name="calendar" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.text}>{alertData.date.toDate().toLocaleDateString()}</Text>

            <FontAwesome name="clock-o" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.text}>{alertData.date.toDate().toLocaleTimeString()}</Text>
          </View>
        )}

        {/* Location */}
        {alertData.location && (
          <View style={styles.dateTimeRow}>
            <FontAwesome name="map-marker" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.text}>{alertData.location}</Text>
          </View>
        )}

        {alertData.type === 'event' && (
        <TouchableOpacity
            style={[styles.bellIcon, isBookmarked && { backgroundColor: colors.primary }]}
            onPress={handleBookmark}
        >
            <Ionicons name="bookmark-outline" size={30} color={isBookmarked ? '#fff' : '#333'} />
        </TouchableOpacity>
        )}
      </View>
    </ScrollView> 
  );
};

export default AlertDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f3f4f6',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 0,  // Space before message text
  },
  typeBadge: {
    backgroundColor: '#e0f2fe', // Light blue background for the type
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  typeText: {
    fontSize: 18,
    color: colors.primary,  // Your primary color for text
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    minHeight: 100,  // Minimum height added
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15, // Added space between the message and date/time
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 10, // Space between the icons and the text
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'center',  // Center the date and time section
    alignItems: 'center',      // Aligning icons and text vertically centered
    marginTop: 10,             // Space before the date/time section
  },
  icon: {
    marginRight: 8,  // Space between icon and text
  },
  bellIcon: {
    padding: 15,
    backgroundColor: '#e0f2fe',
    borderRadius: 30,
    alignSelf: 'center', // Centers the bell icon
    marginVertical: 40,
  },
});
