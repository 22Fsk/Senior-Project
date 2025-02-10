import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ColorList from '../../components/ColorList'

const create = () => {
  return (
    <View>
      <ColorList color="green" />
    </View>
  )
}

export default create

const styles = StyleSheet.create({})