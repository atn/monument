// https://halfhollowhills.instructure.com/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false

import React, { useState, useEffect } from 'react'
import { Text, View, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import { MsgCell } from './MsgCell'

export function Inbox() {
  const [conversations, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const {token, domain} = useSelector((state: any) => state)
  useEffect(() => {
    setRefresh(false)
    fetchAPI()
  }, [])

  function fetchAPI() {
    fetch(`https://${domain}/api/v1/conversations?scope=inbox`, {
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
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Inbox</Text>
      { conversations &&
          <FlatList refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} renderItem={renderItem} data={conversations} keyExtractor={(item: any) => item.id} />
      }
    </View>
    )
}

function renderItem({ item }: any) {
  return <MsgCell item={item} />
}