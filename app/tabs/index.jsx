import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import colors from '../../components/ColorTamp';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Pressable } from 'react-native';


const index = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };
  

  useFocusEffect(
    useCallback(() => {
      const fetchBookmarkedEvents = async () => {
        try {
          setLoading(true);
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
    }, [])
  );

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

    todayEvents.sort((a, b) => moment(a.date.toDate()).diff(b.date.toDate()));
    upcoming.sort((a, b) => moment(a.date.toDate()).diff(b.date.toDate()));
    pastEvents.sort((a, b) => moment(a.date.toDate()).diff(b.date.toDate()));

    return { todayEvents, upcoming, pastEvents };
  };

  const { todayEvents, upcoming, pastEvents } = categorizeEvents();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.7}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.metaRow, styles.typeBadge]}>
          <MaterialCommunityIcons name="calendar-star" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
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
    </TouchableOpacity>
  );
  

  const renderSectionHeader = (title, show, toggle, count) => (
    <TouchableOpacity onPress={toggle} style={styles.cardtitle}>
      <View style={styles.sectionHeader}>
        <View style={{flexDirection: 'row'}}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>
        {count >= 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
        </View>
        <FontAwesome name={show ? 'chevron-up' : 'chevron-down'} size={16} color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
  
  
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Today Section */}
      {renderSectionHeader("Today's Events", showToday, () => setShowToday(!showToday), todayEvents.length)}
      {showToday && (
        todayEvents.length > 0 ? (
          todayEvents.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))
        ) : (
          <Text style={styles.emptyText}>No events today.</Text>
        )
      )}
  
      {/* Upcoming Section */}
      {renderSectionHeader("Upcoming Events", showUpcoming, () => setShowUpcoming(!showUpcoming), upcoming.length)}
      {showUpcoming && (
        upcoming.length > 0 ? (
          upcoming.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming events.</Text>
        )
      )}
  
      {/* Past Section */}
      {renderSectionHeader("Past Events", showPast, () => setShowPast(!showPast), pastEvents.length)}
      {showPast && (
        pastEvents.length > 0 ? (
          pastEvents.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))
        ) : (
          <Text style={styles.emptyText}>No past events.</Text>
        )
      )}
  
      <View style={{ height: 120 }} />
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <ScrollView>
        <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>

        {/* Highlight (was Type) */}
        <View style={[styles.metaRow, styles.typeBadge]}>
          <MaterialCommunityIcons name="star-four-points" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.typeText}>{selectedEvent?.type}</Text>
        </View>

        {/* Date */}
        <View style={styles.metaRow}>
          <FontAwesome name="calendar" size={14} color={colors.primary} style={styles.icon} />
          <Text style={styles.modalDate}>
            {moment(selectedEvent?.date.toDate()).format('MMM D, YYYY')}
          </Text>
        </View>

        {/* Time */}
        <View style={styles.metaRow}>
          <FontAwesome name="clock-o" size={14} color={colors.primary} style={styles.icon} />
          <Text style={styles.modalDate}>
            {moment(selectedEvent?.date.toDate()).format('h:mm A')}
          </Text>
        </View>

        {/* Location */}
        {selectedEvent?.location && (
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.primary} style={styles.icon} />
            <Text style={styles.modalLocation}>{selectedEvent.location}</Text>
          </View>
        )}

        {/* Message */}
        {selectedEvent?.message && (
          <View style={styles.metaRow}>
            <Text style={styles.modalMsg}>{selectedEvent.message}</Text>
          </View>
        )}

        {/* Close Button */}
        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
          <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  </View>
</Modal>



    </ScrollView>
    
  );
};

export default index;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgb(245, 251, 253)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardtitle: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6b7280',
    marginLeft: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  modalType: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.primary,
  },
  modalDate: {
    fontSize: 14,
    marginBottom: 4,
    color: '#6b7280',
  },
  modalMsg: {
    fontSize: 14,
    marginTop: 10,
    color: '#374151',
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginLeft: 8,  
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
