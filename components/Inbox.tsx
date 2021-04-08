// https://halfhollowhills.instructure.com/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false

import React, { useState, useEffect } from 'react'
import { Text, FlatList, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { MsgCell } from './MsgCell'

import { makeApiRequest } from '../utils/rest.util'

export function Inbox() {
  const state = useSelector((state: any) => state)
  const dispatch = useDispatch()
  const [conversations, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  useEffect(() => {
    try {
      storeApi(state.inbox_cache)
      setTimeout(() => fetchAPI(), 100)
    } catch (err) {
      alert(err.toString())
    }
  }, [])

  function fetchAPI() {
    setRefresh(true)
    makeApiRequest('/conversations?scope=inbox', state)
      .then(res => {
        if (!res.ok) throw new Error(`Server responded with error ${res.status} (${res.type})`)
        res.json().then((json) => {
          if (json) {
            dispatch({type: 'SETINBOXCACHE', value: json})
            storeApi(json)
            return setRefresh(false)
          }
          storeApi([])
          setRefresh(false)
        })
      })
  }

  return (
    <SafeAreaView style={{flexGrow: 1, margin: 17}}>
      <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Inbox</Text>
      {conversations &&
          <FlatList refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} renderItem={renderItem} data={conversations} keyExtractor={(item: any) => item.id} />
      }
    </SafeAreaView>
    )
}

function renderItem({ item }: any) {
  return <MsgCell item={item} />
}