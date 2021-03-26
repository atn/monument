import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AppState, SafeAreaView, Text, Button, View, AppStateStatus, FlatList } from 'react-native'

import { SocketManager } from '../../utils/socket.util'

type wsc = [
  wsc: SocketManager,
  setWsc: any
]

export function Chat() {
  const [ status, setStatus ] = useState('Disconnected')
  const [ messages, setMessages ] = useState([])
  const [ wsc, setWsc ]: wsc = useState(null)
  const appState = useRef(AppState.currentState);
  const state = useSelector((state: any) => state)

  useEffect(() => {
    connect()
  }, [])

  return (
    <SafeAreaView style={{margin: 17}}>
      <Text style={{fontSize: 30, fontWeight: 'bold'}}>Chat</Text>
      <Text style={{paddingTop: 5}}>{status}</Text>
      {status === 'Disconnected' ?
        (<Button title='Retry' onPress={() => alert('this button does nothing, restart the app to reconnect.')} />)
        :
        (<Button title='test' onPress={() => wsc.send('SEND_MSG', {content: 'hi'})}/>)
      }
      <FlatList renderItem={renderItem} style={{}} data={messages} keyExtractor={(item: any) => item.content} />
    </SafeAreaView>
  )

  // functions

  function connect() {
    const wsURL = `ws://192.168.1.234:3001?domain=${state.domain}&refresh=${state.refresh}`
    let connection = new SocketManager(wsURL)
    setWsc(connection)
    listen(connection)

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        connection = new SocketManager(wsURL)
        setWsc(connection)
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