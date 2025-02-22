import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../../components/TabBar'

const _layout = () => {
  return (
    <Tabs
        tabBar={props=> <TabBar {...props}/>} 
    >
        <Tabs.Screen
        name="index"
        options={{
            title:"Home"
        }} 
        />
        <Tabs.Screen
        name="DrSchedule"
        options={{
            title:"Facilities"
        }} 
        />
        <Tabs.Screen
        name="map"
        options={{
            title: "",
        }} 
        />
        <Tabs.Screen
        name="alerts"
        options={{
            title:"Alerts"
        }} 
        />
        <Tabs.Screen
        name="settings"
        options={{
            title:"Settings"
        }} 
        />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})