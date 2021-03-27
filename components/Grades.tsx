import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'

export function Grades() {
  return (
    <SafeAreaView style={{margin: 17, marginBottom: 70}}>
      <View>
        <Text style={{fontSize: 15, fontWeight: '600'}}>Infinite Campus</Text>
        <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Grades</Text>
      </View>
      <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600'}}>Coming Soon 👀</Text>
    </SafeAreaView>
  )
}