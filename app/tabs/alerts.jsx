import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../components/ColorTamp';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const navigation = useNavigation();  // Make sure useNavigation is being used for navigation
  const [selectedType, setSelectedType] = useState('All');

  const alertTypes = ['All', 'Event', 'Reminder', 'Academic', 'Maintainance', 'Emergency'];

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'event':
        return 'calendar-star';
      case 'reminder':
        return 'bell-outline';
      case 'academic':
        return 'school-outline';
      case 'maintainance':
        return 'tools';
      case 'emergency':
        return 'alert-circle-outline';
      default:
        return 'information-outline';
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'alerts'));
        const fetchedAlerts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            type: data.type,
            date: data.date?.toDate?.() || null,  // Firestore Timestamp to JS Date
            subscribed: false,
          };
        });
        setAlerts(fetchedAlerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleClick = (alertId) => {
    navigation.navigate('alerts/alertDetails', { alertId });
  };

  const filteredAlerts = selectedType === 'All'
  ? alerts
  : alerts.filter(alert => alert.type.toLowerCase() === selectedType.toLowerCase());

  

  const renderItem = ({ item }) => (
    <View>
      <Pressable
        style={styles.alertCard}
        onPress={() => handleClick(item.id)}  // Use handleClick with the alert's id
      >
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{item.title}</Text>

            {/* Type Row */}
            <View style={[styles.metaRow, styles.typeBadge]}>
              <MaterialCommunityIcons
                name={getTypeIcon(item.type)}
                size={16}
                color={colors.primary}
                style={styles.icon}
              />
              <Text style={styles.typeText}>{item.type}</Text>
            </View>

            {/* Date and Time Row */}
            <View style={styles.metaRow}>
              {item.date && (
                <>
                  <FontAwesome
                    name="calendar"
                    size={14}
                    color={colors.primary}
                    style={styles.icon}
                  />
                  <Text style={styles.alertDate}>
                    {moment(item.date).format('MMM D, YYYY')}
                  </Text>
                </>
              )}

              {item.date && (
                <>
                  <FontAwesome
                    name="clock-o"
                    size={14}
                    color={colors.primary}
                    style={styles.icon}
                  />
                  <Text style={styles.alertDate}>
                    {moment(item.date).format('h:mm A')}
                  </Text>
                </>
              )}
            </View>
          </View>

         
            <Ionicons
              name={item.subscribed ? 'chevron-down' : 'chevron-forward'}
              size={24}
              color={item.subscribed ? colors.primary : '#6b7280'}
            />
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
      <ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingVertical: 8 }}
>
  {alertTypes.map((type) => (
    <Pressable
      key={type}
      onPress={() => setSelectedType(type)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: selectedType === type ? colors.primary : '#e5e7eb',
        marginRight: 10,
      }}
    >
      <Text
        style={{
          color: selectedType === type ? 'white' : '#374151',
          fontWeight: '500',
          fontSize: 14,
        }}
      >
        {type}
      </Text>
    </Pressable>
  ))}
</ScrollView>
      </View>

      <FlatList
        data={filteredAlerts}
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
    marginBottom: 120,
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
  alertDate: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4, // space between rows
  },
  icon: {
    marginRight: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe', // light blue background (adjustable)
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 6, // space before the next row
  },
  typeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  alertDate: {
    fontSize: 14,
    color: '#6b7280', // gray text
    marginRight: 10, // margin between date/time
  },
});
