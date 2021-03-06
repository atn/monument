import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AppState, SafeAreaView, Text, Button, View, AppStateStatus, FlatList } from 'react-native'

import { SocketManager } from '../../utils/socket.util'

export function Chat() {
  const [ status, setStatus ] = useState('Disconnected')
  const [ messages, setMessages ] = useState([])
  const appState = useRef(AppState.currentState);
  const scrollView = useRef()
  const state = useSelector((state: any) => state)

  useEffect(() => {
    connect()
  }, [])

  return (
    <SafeAreaView style={{margin: 17}}>
      <Text style={{fontSize: 30, fontWeight: 'bold'}}>Chat</Text>
      <Text style={{paddingTop: 5}}>{status}</Text>
      {status === 'Disconnected' &&
        <Button title='Retry' onPress={() => alert('this button does nothing, restart the app to reconnect.')} />
      }
      <FlatList renderItem={renderItem} style={{}} data={messages} keyExtractor={(item: any) => item.content} />
    </SafeAreaView>
  )

  // functions

  function connect() {
    const wsURL = `ws://192.168.1.234:3001?domain=${state.domain}&refresh=${state.refresh}`
    let connection = new SocketManager(wsURL)
    listen(connection)

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('PEJHFKJSH')
        connection = new SocketManager(wsURL)
        listen(connection)
      }
      if (nextAppState === 'background') connection.close()
      appState.current = nextAppState;
    }

    AppState.addEventListener('change', _handleAppStateChange)
  }
  
  function listen(wsc: SocketManager) {
    wsc.on('open', () => {
      setStatus('Connected')
      console.log('open')
      // Heartbeat interval
      setInterval(() => {
        console.log('sending heartbeat')
        wsc.send(85)
      }, 5000)
    })

    wsc.on('msg', (data) => {
      setMessages(messages => [...messages, data])
    })
    
    wsc.on('close', () => {
      setStatus('Disconnected')
      return console.log('close')
    })
  }
}

const renderItem = ({ item }: any) => (
  <Text>{JSON.stringify(item)}</Text>
);