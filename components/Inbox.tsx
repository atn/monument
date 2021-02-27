// https://halfhollowhills.instructure.com/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false

import React, { useState, useEffect } from 'react'
import { Text, View, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import { MsgCell } from './MsgCell'

import { makeApiRequest } from '../utils/rest.util'

export function Inbox() {
  const [conversations, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const state = useSelector((state: any) => state)
  useEffect(() => {
    setRefresh(true)
    fetchAPI()
  }, [])

  function fetchAPI() {
    makeApiRequest('/conversations?scope=inbox', state)
    .then(res => res.json().then((json) => {
      if (json) {
        storeApi(json)
        return setRefresh(false)
      }
      storeApi([])
    }))
  }

  return (
    <View style={{marginTop: 50, marginBottom: 60, margin: 17, borderRadius: 20}}>
      <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Inbox</Text>
      {conversations &&
          <FlatList refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} renderItem={renderItem} data={conversations} keyExtractor={(item: any) => item.id} />
      }
    </View>
    )
}

function renderItem({ item }: any) {
  return <MsgCell item={item} />
}