import React from 'react'
import { View, Text } from 'react-native'


export function ChatBubble({props}: any) {
  return (
    <View style={{borderRadius: 20, backgroundColor: 'blue', margin: 5, padding: 10}}>
      <Text>test msg</Text>
    </View>
  )
}