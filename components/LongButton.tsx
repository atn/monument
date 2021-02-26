import React from 'react'
import {TouchableOpacity, Text} from 'react-native'

type props = {
  onPress: () => void,
  title: string,
  color: string,
  disabled: boolean
}

export const LongButton = ({ onPress, title, color, disabled }: any) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={{elevation: 8, marginTop: 10, backgroundColor: color, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12,}}>
    <Text style={{textAlign: 'center'}}>{title}</Text>
  </TouchableOpacity>
);