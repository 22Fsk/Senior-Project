import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Feather, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';
import InteractiveMap from '../../components/interactiveMap';
import colors from '../../components/ColorTamp';
import MapView from 'react-native-maps';
//import floorMap from '../floors/level0.jeojson';

const Index = () => {
  const sheetRef = useRef(null); // Define the sheetRef here

  const [view, setView] = useState('history'); // 'history' or 'doctors'
  const [serach, setSearch] = useState('');
  const snapPoints = ['20%','50%', '95%'];

  const historyList = ['S40-2049', 'S40-060', 'Food Court'];
  const doctorsList = ['Dr. John Doe', 'Dr. Jane Smith', 'Dr. Sarah Johnson'];

  const handleButtonPress = (viewType) => {
    setView(viewType);
  };

  const buttonStyles = [
    styles.button, 
    view === 'history' ? styles.selectedButton : null
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <View>
            <InteractiveMap />
        </View>

      <BottomSheet ref={sheetRef} snapPoints={snapPoints} 
      backgroundStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} 
      handleIndicatorStyle={{ backgroundColor: 'rgb(199, 199, 199)'}}
      >
        <BottomSheetView style={styles.btm} backgroundStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} >
          <ScrollView contentContainerStyle={{ gap: 15 }}>
            {/** Search Bar */}
            <View style={styles.searchBar}>
              <View style={styles.searchIcon}>
                <Feather name="search" size={20} color={'gray'} />
              </View>
              <TextInput
                placeholder='Search for places...'
                value={serach}
                onChangeText={value => setSearch(value)}
                style={styles.searchInput}
                placeholderTextColor="gray"
              />
              {serach && (
                <Pressable style={styles.closeIcon}
                onPress={() => setSearch('')}>
                  <Ionicons name="close" size={20} color={'black'} />
                </Pressable>
              )}
            </View>

            <View style={styles.catContainer}>
              <View style={styles.buttonContainer}>
                {/* History Button */}
                <TouchableOpacity
                  style={buttonStyles}
                  onPress={() => handleButtonPress('history')}
                >
                  <MaterialIcons name='history' size={24} color={view === 'history' ? colors.primary : "black"} style={styles.buttonIcon}/>
                  <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>

                {/* Doctors Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    view === 'doctors' ? styles.selectedButton : null,
                  ]}
                  onPress={() => handleButtonPress('doctors')}
                >
                  <Fontisto name='person' size={20} color={view === 'doctors' ? colors.primary: "black"} style={styles.buttonIcon}/>
                  <Text style={styles.buttonText}>Doctors</Text>
                </TouchableOpacity>
              </View>

              {/* Conditionally render content based on selected view */}
              {view === 'history' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>History</Text>
                  {historyList.map((item, index) => (
                    <Pressable 
                      key={index} 
                      style={styles.listItemBox} 
                      onPress={() => console.log(`Selected: ${item}`)} // Replace this with navigation or action
                    >
                      <Text style={styles.listItemText}>{item}</Text>
                      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
                    </Pressable>
                  ))}
                </View>
              ) : view === 'doctors' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>Doctors</Text>
                  {doctorsList.map((item, index) => (
                    <Pressable 
                      key={index} 
                      style={styles.listItemBox} 
                      onPress={() => console.log(`Selected: ${item}`)} // Replace this with navigation or action
                    >
                      <Text style={styles.listItemText}>{item}</Text>
                      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text style={styles.placeholder}>Select an option to view content</Text>
              )}


            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  btm: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchBar: {
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
  catContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    backgroundColor: 'rgba(244, 244, 244, 0.74)',
    borderRadius: 15,
    marginBottom: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'rgba(199, 199, 199, 0.5)',  // Set your desired background color here
    borderRadius: 15,            // Optional: to give rounded corners
    padding: 2,   
  },
  button: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center align items
    justifyContent: 'center', // Center everything inside
    paddingVertical: '10',
    paddingHorizontal: '11.5%',
    borderRadius: 12,
    backgroundColor: 'rgba(199, 199, 199, 0.1)',
    margin: 2,
  },
  buttonIcon: {
    marginRight: 8, // Adjust spacing between icon and text
  },
  selectedButton: {
    backgroundColor: 'white', // Blue when selected
  },
  buttonText: {
    color: 'Black',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemBox: {
    flexDirection: 'row',  // Align text and icon in one line
    justifyContent: 'space-between', // Space out text and arrow icon
    alignItems: 'center',  // Center items vertically
    padding: 12,  // Add padding for a better look
    backgroundColor: 'white',  // Box background color
    borderRadius: 10,  // Rounded corners
    marginBottom: 8,  // Space between items
    shadowColor: '#000',  // Add subtle shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,  // Elevation for Android shadow effect
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
});
