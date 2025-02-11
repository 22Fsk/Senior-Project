import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';

const Index = () => {
  const sheetRef = useRef(null); // Make sure the ref is typed correctly if using TypeScript
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ['30%', '50%','95%'];
  const [serach, setSearch] = useState('');
  const searchInputRef = useRef(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap your component in GestureHandlerRootView */}
      <BottomSheet
        ref={sheetRef} // Ensure this is the correct usage of ref
        snapPoints={snapPoints}
        
      >
        <BottomSheetView style={styles.btm}> {/* Wrap the content inside BottomSheetView */}
          <ScrollView contentContainerStyle={{gap: 15}}>
            {/** search bar */}
        <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
                <Feather name="search" size={20} color={'gray'} />
            </View>
            <TextInput 
            placeholder='Search for places...' 
            value={serach}
            ref={searchInputRef}
            onChangeText={value=> setSearch(value)}
            style={styles.searchInput} />
            {
                serach && (
                    <Pressable style={styles.closeIcon}>
                        <Ionicons name="close" size={20} color={'black'}/>
                    </Pressable>  
                )
            }

            
        </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btm: {
    padding: 20, 
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
closeIcon:{
    backgroundColor: 'lightgray',
    padding:1,
    borderRadius: 20,
    marginRight:6,
}
});
