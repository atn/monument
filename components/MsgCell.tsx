import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

type props = {
  item: any
}

export function MsgCell(props: props) {
  return (
    <>
      <TouchableOpacity activeOpacity={0.4}>
        <View style={{borderRadius: 9, padding: 11, margin: 4, backgroundColor: '#fff'}}  key={props.item.id}>
          <Text style={{fontWeight: 'bold'}}>{props.item.subject}</Text>
          {props.item.participants.length === 2 &&
            <Text style={{fontSize: 13}}>{props.item.participants[0].name} and {props.item.participants[1].name}</Text>
          } 
        </View>
      </TouchableOpacity>
    </>
  )
}