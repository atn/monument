import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { AssignmentModal } from './AssignmentModal'
import { styles } from '../styles'
import { dateTimeFormat } from './TodoList'
import { Ionicons } from '@expo/vector-icons'

export function NotificationCell({ item }: any) {
  const [showing, setShow] = React.useState(false)
  return (
    <>
    <AssignmentModal close={() => setShow(false)} assignment={item} isShowing={showing} />
    <TouchableOpacity activeOpacity={0.4} onPress={()=> setShow(true)}>
      <View style={styles.notifCell} key={item.id || item.quiz_id}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
            <Text style={{fontSize: 13}}>Due {dateTimeFormat.format(new Date(item.due_at))}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </>
  )
}