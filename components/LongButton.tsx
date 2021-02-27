import React from 'react'
import {TouchableOpacity, Text} from 'react-native'

type props = {
  onPress: () => void,
  title: string,
  color: string,
  disabled: boolean
}

export const LongButton = ({ onPress, title, color, disabled }: any) => (
  <TouchableOpacity activeOpacity={0.6} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} disabled={disabled} onPress={onPress} style={{elevation: 8, marginTop: 10, backgroundColor: color, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12,}}>
    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{title}</Text>
  </TouchableOpacity>
);