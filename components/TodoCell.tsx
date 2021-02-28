import React from 'react'
import { Text, View, TouchableOpacity} from 'react-native'
import { dateTimeFormat, todayFormat } from './TodoList'
import { styles } from '../styles'

import { AssignmentModal } from './AssignmentModal'

type props = {
  item: any
}

const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

export function TodoCell(props: props) {
  const [showing, setShow] = React.useState(false)

  return (
    <>
      <AssignmentModal close={() => setShow(false)} assignment={props.item.assignment} isShowing={showing} />
      <TouchableOpacity activeOpacity={0.4} onPress={()=> setShow(true)}>
        <View style={styles.cell} key={props.item.assignment.id || props.item.assignment.quiz_id}>
          <Text style={{fontWeight: 'bold'}}>{props.item.assignment.name}</Text>
          <Text style={{fontSize: 13}}>Due {isToday(new Date(props.item.assignment.due_at)) ? `Today at ${todayFormat.format(new Date(props.item.assignment.due_at))}` : dateTimeFormat.format(new Date(props.item.assignment.due_at))}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}