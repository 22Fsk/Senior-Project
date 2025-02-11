import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

const Index = () => {
  const sheetRef = useRef(null); // Make sure the ref is typed correctly if using TypeScript
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ['25%', '50%','70%'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap your component in GestureHandlerRootView */}
      <BottomSheet
        ref={sheetRef} // Ensure this is the correct usage of ref
        snapPoints={snapPoints}
        
      >
        <BottomSheetView style={styles.btm}> {/* Wrap the content inside BottomSheetView */}
          
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
    padding: 50, 
  }
});
