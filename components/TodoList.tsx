import React, { useState, useEffect } from 'react'
import { Text, View, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { makeApiRequest } from '../utils/rest.util'

import { TodoCell } from './TodoCell'

export const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

export function Todo() {
  const [assignments, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
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
  }

  return (
    <View style={{marginTop: 60, marginBottom: 60, margin: 17, borderRadius: 20}}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
          <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Todo List</Text>
        </View>
      </View>
        {assignments &&
          <FlatList style={{paddingBottom: 100}} refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} data={assignments} renderItem={renderItem} keyExtractor={(item: any) => item.assignment.id || item.assignment.quiz_id} />
        }
    </View>
    )
}

const renderItem = ({ item }: any) => (
  <TodoCell item={item}/>
);