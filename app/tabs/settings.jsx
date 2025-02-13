import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // If you want to navigate to other screens

const settings = () => {
  const router = useRouter();

  // Sample settings data for each section
  const sections = [
    {
      title: "App Settings",
      data: [
        { label: "Theme Color", navigateTo: "/theme" },
        { label: "Language", navigateTo: "/language" },
        { label: "Clear Cache", navigateTo: "/clearCache" },
      ],
    },
    {
      title: "Notifications",
      data: [
        { label: "Push Notifications", navigateTo: "/pushNotifications" },
      ],
    },
    {
      title: "Support",
      data: [
        { label: "FAQ", navigateTo: "/faq" },
        { label: "Contact Us", navigateTo: "/contactUs" },
        { label: "About App", navigateTo: "/about" },
        { label: "Share App", navigateTo: "/shareApp" },
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
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(item.navigateTo)}
                  style={styles.settingItem}
                >
                  <Text style={styles.settingText}>{item.label}</Text>
                  <Entypo name="chevron-right" size={20} color="gray" />
                </TouchableOpacity>
              )}
            />
          </View>
          </View>
        )}
      />
      
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
    marginBottom: 20, // Space between sections
    backgroundColor: '#fff', // White background for each section
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow direction
    shadowOpacity: 0.1, // Subtle shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 4, // Shadow for Android (elevation property)
    marginHorizontal:10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10, // Space between title and items
    paddingHorizontal: 10, // Add horizontal padding for title
    paddingTop: 15, // Padding at the top of the section title
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15, // Padding around the text
    borderBottomWidth: 1, // Add a line between items
    borderBottomColor: '#ddd', // Line color
    paddingHorizontal: 25, // Add horizontal padding for each item
  },
  settingText: {
    fontSize: 16,
    color: '#555',
  },
});

export default settings;
