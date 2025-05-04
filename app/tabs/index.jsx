import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import colors from '../../components/ColorTamp';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const index = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        const saved = await AsyncStorage.getItem('bookmarkedEvents');
        const savedIds = saved ? JSON.parse(saved) : [];
        const fetchEventPromises = savedIds.map(async (id) => {
          const docRef = doc(db, 'alerts', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { id, ...docSnap.data() };
          } else {
            console.warn(`No such event with ID: ${id}`);
            return null;
          }
        });
        const events = await Promise.all(fetchEventPromises);
        const filteredEvents = events.filter((event) => event !== null);

        setBookmarkedEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching bookmarked events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (bookmarkedEvents.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No bookmarked events found.</Text>
      </View>
    );
  }

  // Categorize events
  const categorizeEvents = () => {
    const today = moment().startOf('day');
    const upcoming = [];
    const todayEvents = [];
    const pastEvents = [];

    bookmarkedEvents.forEach((event) => {
      const eventDate = moment(event.date.toDate());
      if (eventDate.isSame(today, 'day')) {
        todayEvents.push(event);
      } else if (eventDate.isAfter(today)) {
        upcoming.push(event);
      } else {
        pastEvents.push(event);
      }
    });

    // Sort the events by date/time
    todayEvents.sort((a, b) => moment(a.date.toDate()).isBefore(b.date.toDate()) ? -1 : 1);
    upcoming.sort((a, b) => moment(a.date.toDate()).isBefore(b.date.toDate()) ? -1 : 1);
    pastEvents.sort((a, b) => moment(a.date.toDate()).isBefore(b.date.toDate()) ? -1 : 1);

    return { todayEvents, upcoming, pastEvents };
  };

  const { todayEvents, upcoming, pastEvents } = categorizeEvents();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      {/* Type Section */}
      <View style={[styles.metaRow, styles.typeBadge]}>
        <MaterialCommunityIcons name="calendar-star" size={16} color={colors.primary} style={styles.icon} />
        <Text style={styles.typeText}>{item.type}</Text>
      </View>

      {/* Date and Time Section */}
      <View style={styles.metaRow}>
        {item.date && (
          <>
            <FontAwesome name="calendar" size={14} color={colors.primary} style={styles.icon} />
            <Text style={styles.alertDate}>
              {moment(item.date.toDate()).format('MMM D, YYYY')}
            </Text>
            <FontAwesome name="clock-o" size={14} color={colors.primary} style={styles.icon} />
            <Text style={styles.alertDate}>
              {moment(item.date.toDate()).format('h:mm A')}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {todayEvents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Today's Events</Text>
          <FlatList
            data={todayEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <FlatList
            data={upcoming}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        </>
      )}

      {pastEvents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <FlatList
            data={pastEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        </>
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  typeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  alertDate: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 16,
  },
});
