import React, { useState, useEffect } from 'react'
import { Text, View, FlatList} from 'react-native'
import { useSelector } from 'react-redux'

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
  const {token, domain} = useSelector((state: any) => state)
  useEffect(() => {
    setRefresh(true)
    fetchAPI()
  }, [])

  function fetchAPI() {
    fetch(`https://${domain}/api/v1/users/self/todo?per_page=100`, {
      "headers": {
        "accept": "application/json+canvas-string-ids, application/json",
        "authorization": `Bearer ${token}`
      },
      "referrer": `https://${domain}/`,
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "mode": "cors",
    }).then(res => res.json().then((json) => {
      if (json) {
        setRefresh(false)
        return storeApi(json)
      }
      storeApi([])
    }))
  }

  return (
    <View style={{marginTop: 60, marginBottom: 55, margin: 17, borderRadius: 20}}>
      <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Todo List</Text>
        {assignments &&
          <FlatList refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} data={assignments} renderItem={renderItem} keyExtractor={(item: any) => item.assignment.id || item.assignment.quiz_id} />
        }
    </View>
    )
}

const renderItem = ({ item }: any) => (
  <TodoCell item={item}/>
);