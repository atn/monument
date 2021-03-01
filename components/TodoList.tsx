import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { makeApiRequest } from '../utils/rest.util'
import { Ionicons } from '@expo/vector-icons'

import BottomSheet from 'reanimated-bottom-sheet'

import { TodoCell } from './TodoCell'

export const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

export const todayFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
});

export function Todo() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  const [assignments, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const missing = React.useRef<BottomSheet>(null);

  useEffect(() => {
    setRefresh(true)
    fetchAPI()
    fetchUser()
  }, [])

  function fetchAPI() {
    makeApiRequest('/users/self/todo?per_page=100', state)
    .then(res => res.json().then((json) => {
      if (json) {
        storeApi(json)
        return setRefresh(false)
      }
      storeApi([])
   }))
  }

  function fetchUser() {
    makeApiRequest('/users/self', state)
    .then(res => res.json().then((json) => {
      if (json) return dispatch({type: 'SETUSER', value: json})
   }))
   makeApiRequest('/courses', state)
   .then(res => res.json().then((json) => {
     console.log(json)
     if (json) return dispatch({type: 'SETCOURSES', value: json})
    }))
  }

  return (
    <>
      <BottomSheet
        ref={missing}
        snapPoints={[-100, 400]}
        renderContent={renderMissing}
      />
    <SafeAreaView style={{margin: 17}}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
          <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Todo</Text>
        </View>
        <TouchableOpacity style={{marginLeft: 'auto', alignSelf: 'center'}}  onPress={() => (missing as any).current.snapTo(1)} >
          <Ionicons name='notifications-circle' size={30} />
        </TouchableOpacity>
      </View>
        {assignments &&
          <FlatList style={{paddingBottom: 100}} refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} data={assignments} renderItem={renderItem} keyExtractor={(item: any) => item.assignment.id || item.assignment.quiz_id} />
        }
    </SafeAreaView>
    </>
    )
}

function renderMissing() {
  return (
    <View style={{height: 400, backgroundColor: `#fff`, borderColor: '#000', borderBottomWidth: 0, borderWidth: 1, borderRadius: 20, padding: 20 }}>
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingBottom: 10}}>Notifications</Text>
      <Text style={{fontSize: 15, fontWeight: 'bold', paddingBottom: 10}}>Coming Soon</Text>
    </View>
  )
}

const renderItem = ({ item }: any) => (
  <TodoCell item={item}/>
);