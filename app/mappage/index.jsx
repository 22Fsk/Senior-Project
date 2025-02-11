import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Feather, Ionicons } from '@expo/vector-icons';

const Index = () => {
  const sheetRef = useRef(null); // Define the sheetRef here

  const [view, setView] = useState('history'); // 'history' or 'doctors'
  const [serach, setSearch] = useState('');
  const snapPoints = ['30%', '50%', '95%'];

  const historyList = ['History Item 1', 'History Item 2', 'History Item 3'];
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
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        <BottomSheetView style={styles.btm}>
          <ScrollView contentContainerStyle={{ gap: 15 }}>
            <View style={styles.searchBar}>
              <View style={styles.searchIcon}>
                <Feather name="search" size={20} color={'gray'} />
              </View>
              <TextInput
                placeholder='Search for places...'
                value={serach}
                onChangeText={value => setSearch(value)}
                style={styles.searchInput}
              />
              {serach && (
                <Pressable style={styles.closeIcon}>
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
                  <Text style={styles.buttonText}>Doctors</Text>
                </TouchableOpacity>
              </View>

              {/* Conditionally render content based on selected view */}
              {view === 'history' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>History</Text>
                  {historyList.map((item, index) => (
                    <Text key={index} style={styles.listItem}>{item}</Text>
                  ))}
                </View>
              ) : view === 'doctors' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>Doctors</Text>
                  {doctorsList.map((item, index) => (
                    <Text key={index} style={styles.listItem}>{item}</Text>
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
    borderColor: 'gray',
    backgroundColor: 'white',
    padding: 4,
    paddingLeft: 10,
    borderRadius: 30,
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
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginBottom: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'rgba(199, 199, 199, 0.5)',  // Set your desired background color here
    borderRadius: 22,            // Optional: to give rounded corners
    padding: 2,   
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: '15%',
    borderRadius: 18,
    backgroundColor: 'rgba(199, 199, 199, 0.1)',
    margin: 2,
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
  placeholder: {
    fontSize: 16,
    color: 'rgb(0, 0, 0)',
  },
});
