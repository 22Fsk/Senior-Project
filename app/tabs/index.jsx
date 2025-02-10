import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ColorList from '../../components/ColorList'

const index = () => {
  return (
    <View>
      <ColorList color="pink" />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", 
  },
})
