import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { dateTimeFormat } from './TodoList'
import { styles } from '../styles'

type props = {
  item: any
}

export function MsgCell(props: props) {
  return (
    <>
      <TouchableOpacity>
        <View style={styles.cell} key={props.item.id}>
          <Text style={{fontWeight: 'bold'}}>{props.item.subject}</Text>
          <Text style={{fontSize: 13}}>{props.item.context_name}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}