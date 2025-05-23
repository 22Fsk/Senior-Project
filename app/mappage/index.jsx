import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Feather, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';
import InteractiveMap from '../../components/interactiveMap';
import colors from '../../components/ColorTamp';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import floor0 from '../floors/level0';
import floor1 from '../floors/level1';
import floor2 from '../floors/level2';

const Index = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const allFloors = [floor0, floor1, floor2];
  const allFeatures = allFloors.flatMap(floor => floor.features);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState([]);

  // Fetch favorite rooms from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favoriteRooms');
        if (stored) {
          setFavoriteRooms(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Error loading favorites:', err);
      }
    };
    loadFavorites();
  }, []);

  // Favorite rooms add them to AsyncStorage
  const toggleFavorite = async (roomName) => {
    const updatedFavorites = favoriteRooms.includes(roomName)
      ? favoriteRooms.filter(name => name !== roomName)
      : [...favoriteRooms, roomName];

    setFavoriteRooms(updatedFavorites);
    try {
      await AsyncStorage.setItem('favoriteRooms', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.log('Error saving favorites:', err);
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
  
    if (query.trim() === '') {
      setSearchResults([]); 
      return;
    }

    const filteredResults = allFloors.flatMap((floor) =>
      floor.features.filter((feature) => {
        const featureName = feature.properties?.name?.toString(); 
        return featureName && featureName.toLowerCase().includes(query.toLowerCase());
      })
    );
    setSearchResults(filteredResults);
  };

  const LoadingOverlay = () => (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
    </View>
  );
  

  const handleResultPress = async (item) => {
    console.log(`Selected: ${item.properties.name}`);
    setLoading(true); 

      // Save to history AsyncStorage
      const roomName = item.properties.name;
      const updatedHistory = [roomName, ...historyList.filter(name => name !== roomName)].slice(0, 5); // Keep recent 5 unique
      setHistoryList(updatedHistory);

      try {
        await AsyncStorage.setItem('roomHistory', JSON.stringify(updatedHistory));
      } catch (err) {
        console.log('Error saving history:', err);
      }
    
    // Find the room's feature from all floors
    for (let floorIndex = 0; floorIndex < allFloors.length; floorIndex++) {
      const floor = allFloors[floorIndex];
      const roomFeature = floor.features.find(
        feature => feature.properties?.name === item.properties.name && feature.geometry?.type === 'Polygon'
      );
  
      if (roomFeature) {
        // Check if the selected floor is different from the current floor
        if (selectedFloor !== floorIndex) {
          // Change the floor and zoom into the room
          setSelectedFloor(floorIndex);
          setTimeout(() => {
            mapRef.current?.zoomToRoom(roomFeature);
            setLoading(false);
          }, 500); 
        } else {
          setTimeout(() => {
            mapRef.current?.zoomToRoom(roomFeature);
            setLoading(false);
          }, 300);
        }

        // Set the bottom sheet to 20%
        sheetRef.current.snapToIndex(0);
        break;
      }
    }
  };  

    // handle doctor to map nav
    useEffect(() => {
      if (office && mapRef.current) {
        let timeoutId;
        setLoading(true);

        // Check all floors
        for (let floorIndex = 0; floorIndex < allFloors.length; floorIndex++) {
          const floor = allFloors[floorIndex];
          const roomFeature = floor.features.find(
            feature =>
              feature.properties?.name?.toString() === office.toString() &&
              feature.geometry?.type === 'Polygon'
          );
    
          if (roomFeature) {
            // if selected floor different than floor index
            if (selectedFloor !== floorIndex) {
              // Change selected floor and zoom
              setSelectedFloor(floorIndex);
              timeoutId = setTimeout(() => {
                mapRef.current?.zoomToRoom?.(roomFeature);
                setLoading(false);
              }, 500);
            } else {
              timeoutId = setTimeout(() => {
                mapRef.current?.zoomToRoom?.(roomFeature);
                setLoading(false);
              }, 300);
            }
            break;
          }
          
        }
    
        // Cleanup timeout if component unmounts or office changes
        return () => {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    }, [office]);

  
  
  // Ask for location access permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied for location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);


  // load saved history on start
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('roomHistory');
        if (stored) {
          setHistoryList(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Error loading history:', err);
      }
    };
  
    loadHistory();
  }, []);

  const { office } = useLocalSearchParams(); 
  const sheetRef = useRef(null);
  const mapRef = useRef();
  const [view, setView] = useState('history'); 
  const snapPoints = ['20%','50%', '80%'];
  const [historyList, setHistoryList] = useState([]);

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
          <View style={{ position: 'absolute', top: 20, right: 0, left: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginRight: 10, textShadowColor: 'black', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1, }}>Floor: </Text>
            {[0, 1, 2].map(floor => (
              <TouchableOpacity
                key={floor}
                onPress={() => setSelectedFloor(floor)}
                style={{
                  backgroundColor: selectedFloor === floor ? colors.primary : '#e0e0e0',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: selectedFloor === floor ? 'white' : 'black', fontSize: 15, fontWeight: 'bold' }}>
                  {floor}
                </Text>
              </TouchableOpacity>
            ))}

          </View>
            <InteractiveMap key={selectedFloor} ref={mapRef} routeCoords={routeCoords} selectedFloor={selectedFloor}/>
        </View>

      <BottomSheet 
      ref={sheetRef} 
      snapPoints={snapPoints} 
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
                value={searchQuery} 
                onChangeText={handleSearch}
                style={styles.searchInput}
                placeholderTextColor="gray"
              />
              {/* search clear */ }
              {searchResults && (
                <Pressable style={styles.closeIcon}
                onPress={() =>{ setSearchQuery(''), setSearchResults('')}}>
                  <Ionicons name="close" size={20} color={'black'} />
                </Pressable>
              )}
            </View>

            {/* search results */}
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.listItemBox}
                  onPress={() => {
                    handleResultPress(item);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  {/* Favorite a Room */}
                  <Text style={styles.listItemText}>{item.properties.name}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.properties.name)}>
                    <FontAwesome
                      name={favoriteRooms.includes(item.properties.name) ? "star" : "star-o"}
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </Pressable>
              ))
            ) : (
              <Text style={styles.placeholder}></Text>
            )}

          {!searchResults.length && (
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

                {/* Favorite Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    view === 'Favorite' ? styles.selectedButton : null,
                  ]}
                  onPress={() => handleButtonPress('Favorite')}
                >
                  <Fontisto name='star' size={20} color={view === 'Favorite' ? colors.primary: "black"} style={styles.buttonIcon}/>
                  <Text style={styles.buttonText}>Favorite</Text>
                </TouchableOpacity>
              </View>

              {/* show content based on selected view */}
              {view === 'history' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>History</Text>
                  {historyList.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.listItemBox} 
                      onPress={() => {
                          const room = allFeatures.find(f => f.properties?.name === item);
                          if (room) handleResultPress(room);
                        }}
                    >
                      <Text style={styles.listItemText}>{item}</Text>
                      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : view === 'Favorite' ? (
                <View style={styles.listContainer}>
                  <Text style={styles.title}>Favorites</Text>
                  {favoriteRooms.length === 0 ? (
                    <Text>No favorites yet.</Text>
                  ) : (
                    favoriteRooms.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.listItemBox}
                        onPress={() => {
                          const room = allFeatures.find(f => f.properties?.name === item);
                          if (room) handleResultPress(room);
                        }}
                      >
                        <Text style={styles.listItemText}>{item}</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="gray" />
                      </TouchableOpacity>
                    ))
                  )}
                </View>

              ) : (
                <Text></Text>
              )}
            </View>
          )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>

      {loading && <LoadingOverlay />}
      
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
    backgroundColor: 'rgba(199, 199, 199, 0.5)',  
    borderRadius: 15, 
    padding: 2,   
  },
  button: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: '10',
    paddingHorizontal: '11.5%',
    borderRadius: 12,
    backgroundColor: 'rgba(199, 199, 199, 0.1)',
    margin: 2,
  },
  buttonIcon: {
    marginRight: 8, 
  },
  selectedButton: {
    backgroundColor: 'white', 
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
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',  
    padding: 12,  
    backgroundColor: 'white',  
    borderRadius: 10,  
    marginBottom: 8,  
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
});
