import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable, Switch } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Share } from 'react-native';
import { ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { ToastAndroid, Platform, Alert } from 'react-native';
import colors from '../../components/ColorTamp';


const settings = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // handle share app option
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this awesome campus navigation app! Download it from: https://yourapp.link',
      });
    } catch (error) {
      console.error('Error sharing the app:', error);
    }
  };

  const renderModalContent = () => {
    // FAQ option Content
    if (modalContent.title === "FAQ") {
      return (
        <ScrollView style={styles.modalScroll}>
          <Text style={styles.modalQuestion}>1. How do I find a classroom or room?</Text>
          <Text style={styles.modalAnswer}>
            Go to the map page, slide up the bottom sheet and search for the room in search bar.
          </Text>
  
          <Text style={styles.modalQuestion}>2. Can I get walking directions to a location?</Text>
          <Text style={styles.modalAnswer}>
            Yes! Just tap on any room to see the path from your current location.
          </Text>
  
          <Text style={styles.modalQuestion}>3. How do I see my professor’s office hours?</Text>
          <Text style={styles.modalAnswer}>
            Go to the faculty page and search the professor’s name to view availability and contact info.
          </Text>
  
          <Text style={styles.modalQuestion}>4. What if my location is wrong?</Text>
          <Text style={styles.modalAnswer}>
            Make sure location permissions are enabled and that you're connected to campus Wi-Fi for better accuracy.
          </Text>
  
          <Text style={styles.modalQuestion}>5. Can I bookmark or save locations/events?</Text>
          <Text style={styles.modalAnswer}>
            Yes. Just tap the bookmark icon on events or locations to save them for quick access.
          </Text>
  
          <Text style={styles.modalQuestion}>6. Is the app available offline?</Text>
          <Text style={styles.modalAnswer}>
            Some features may work offline, but real-time navigation and updates require an internet connection.
          </Text>
  
          <Text style={styles.modalQuestion}>7. How do I report a wrong location or issue?</Text>
          <Text style={styles.modalAnswer}>
            Go to the “Contact Us” section and send us your feedback.
          </Text>

        </ScrollView>
      );
    }
    // Contact Us option content
    if (modalContent.title === "Contact Us") {
      const email = "support@smartmap.com";
    
      const copyEmail = async () => {
        await Clipboard.setStringAsync(email);
        if (Platform.OS === 'android') {
          ToastAndroid.show("Email copied to clipboard", ToastAndroid.SHORT);
        } else {
          Alert.alert("Copied", "Email copied to clipboard");
        }
      };
    
      return (
        <View style={styles.contactContainer}>
          <Text style={styles.modalTextC}>
            You can reach us at:
          </Text>
          <View style={styles.emailRow}>
            <TouchableOpacity onPress={copyEmail}>
              <MaterialIcons name="content-copy" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.emailText}>{email}</Text>
            
          </View>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.modalScroll}>
        <Text style={styles.modalText}>{modalContent.body}</Text>
      </ScrollView>
    );
  };

  const sections = [
    {
      title: "Notifications",
      data: [
        {
          label: "Push Notifications",
          isSwitch: true,
          description: "Receive updates about events, schedule changes, and important announcements."
        },
        
      ],
    },
    {
      title: "Support",
      data: [
        { label: "FAQ", isModal: true, content: { title: "FAQ", body: "Here are the most frequently asked questions..." } },
        { label: "Contact Us", isModal: true, content: { title: "Contact Us", body: "You can reach us at support@example.com" } },
        {
          label: "About App",
          isModal: true,
          content: {
            title: "About the App",
            body: `
        Campus Navigator is a student-friendly indoor navigation app designed to enhance the campus experience.
        
What You Can Do:

• Navigate the campus with indoor maps for classrooms, labs, and offices.

• View professor details such as email, office, and schedule.

• Receive notifications for bookmarked events and alerts.

• Bookmark events to revisit later.

• Share the app easily with friends.
        
Why We Built It:
This app was created by students who understand the daily challenges of navigating a large university. Our goal is to save your time, reduce stress, and help you make the most of your academic life.
        
Enjoy smarter navigation and a more connected campus experience — all in one app.
        
Made with love by students, for students.

App Version: 1.0.0
            `.trim()
          }
        }
        ,        
        { label: "Share App", onPress: handleShareApp },
      ],
    },
  ];
  
  

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <View style={styles.section}>
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                if (item.isSwitch) {
                  return (
                    <View style={styles.settingItem}>
                      <Text style={styles.settingText}>{item.label}</Text>
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={() => setNotificationsEnabled((prev) => !prev)}
                        trackColor={{ false: '#ccc', true: colors.primary }}
                        thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
                      />
                    </View>
                  );
                }
              
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.isModal) {
                        setModalContent(item.content);
                        setModalVisible(true);
                      } else if (item.onPress) {
                        item.onPress();
                      } else {
                        router.push(item.navigateTo);
                      }
                    }}
                  >
                    <View style={styles.settingItem}>
                      <Text style={styles.settingText}>{item.label}</Text>
                      <Entypo name="chevron-right" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                );
              }}
              
            />
          </View>
          {item.title === "Notifications" && (
            <Text style={styles.sectionDescription}>
              Receive updates about events, schedule changes, and important announcements.
            </Text>
          )}
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            {renderModalContent()}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 120,
  },
  section: {
    marginBottom: 10, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 4, 
    marginHorizontal:10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10, 
    paddingHorizontal: 10, 
    paddingTop: 15, 
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    paddingHorizontal: 25, 
  },
  settingText: {
    fontSize: 16,
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  modalTextC: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: 400, // adjust based on screen
  },
  modalQuestion: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  modalAnswer: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  contactContainer: {
    marginBottom: 20,
  },
  emailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    paddingHorizontal: 25,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  
});

export default settings;
