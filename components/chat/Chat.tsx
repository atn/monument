import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView, Text, Button, View } from 'react-native'

type wsState = [
  ws: WebSocket,
  setWs: any
]

export function Chat() {
  const [ status, setStatus ] = useState('Disconnected')
  const state = useSelector((state: any) => state)
  useEffect(() => {
    const connection = new WebSocket(`ws://192.168.1.234:3001?domain=${state.domain}&refresh=${state.refresh}`)
    listen(connection)
  }, [])
  
  function listen(wsc: WebSocket) {
    wsc.onopen = function() {
      setStatus('Connected')
      console.log('open')
      wsc.send(JSON.stringify({joe: 'mama'}))
    }
  
    wsc.onmessage = function(msg) {
      console.log(msg)
    }
    
    wsc.onclose = function() {
      setStatus('Disconnected')
      console.log('close')
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