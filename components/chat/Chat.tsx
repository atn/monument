import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AppState, SafeAreaView, Text, Button, View } from 'react-native'

type wsState = [
  ws: WebSocket,
  setWs: any
]

export function Chat() {
  const [ status, setStatus ] = useState('Disconnected')
  const appState = useRef(AppState.currentState);
  const state = useSelector((state: any) => state)

  useEffect(() => {
    connect()
  }, [])

  function connect() {
    const wsURL = `ws://192.168.1.234:3001?domain=${state.domain}&refresh=${state.refresh}`
    let connection = new WebSocket(wsURL)
    listen(connection)

    const _handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('')
        connection = new WebSocket(wsURL)
        listen(connection)
      }

      if (nextAppState === 'background') {
        console.log('dsfda')
        connection.close()
      }
  
      appState.current = nextAppState;
    };
  

    AppState.addEventListener('change', _handleAppStateChange)
  }
  
  function listen(wsc: WebSocket) {
    wsc.onopen = function() {
      setStatus('Connected')
      console.log('open')
      // Heartbeat interval
      setInterval(() => {
        wsc.send(JSON.stringify({op: 85}))
      }, 5000)
    }
  
    wsc.onmessage = function(msg) {
      console.log(msg)
    }
    
    wsc.onclose = function() {
      setStatus('Disconnected')
      return console.log('close')
    }
  }

  return (
    <SafeAreaView style={{margin: 17}}>
      <Text style={{fontSize: 30, fontWeight: 'bold'}}>Chat</Text>
      <Text style={{paddingTop: 5}}>{status}</Text>
      {status === 'Disconnected' &&
        <Button title='Retry' onPress={() => alert('this button does nothing')} />
      }
    </SafeAreaView>
  )
}