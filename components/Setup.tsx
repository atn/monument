import React, { useState } from 'react'
import { Text, View, TextInput } from 'react-native'
import { LongButton } from './LongButton'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function Setup() {
  const [domain, onChangeDomain] = useState('')
  const [token, onTokenChange] = useState('')
  const dispatch = useDispatch()

  function setup(domain: string, token: string) {
    // TODO: check if token is valid
    console.log(domain, token)
    dispatch({type: 'SETTOKEN', value: token})
    dispatch({type: 'SETDOMAIN', value: domain.toLowerCase()})
    AsyncStorage.setItem('canvas-auth', token)
    AsyncStorage.setItem('canvas-domain', domain.toLowerCase())
  }

  return (
    <View>
      <View style={{marginTop: 60, marginBottom: 55, margin: 17, borderRadius: 20}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Setup</Text>
        <Text style={{fontWeight: 'bold', paddingBottom: 5, fontSize: 18}}>Hey! Ready to start setup?</Text>
        <Text style={{fontWeight: 'bold', paddingBottom: 5, paddingTop: 30, fontSize: 18}}>What's your schools Canvas domain name?</Text>
        <Text style={{paddingBottom: 5, fontSize: 13}}>Usually, it's similar to "your-school.instructure.com"</Text>
        <TextInput
          style={{ borderRadius: 10, backgroundColor: '#fff', padding: 7, fontSize: 17, height: 35, width: 300 }}
          onChangeText={text => onChangeDomain(text)}
          value={domain}
          autoFocus={true}
          autoCorrect={false}
          placeholder="example.com"
        />
        <Text style={{fontWeight: 'bold', paddingBottom: 5, paddingTop: 30, fontSize: 18}}>Nice, paste your canvas authorization token here.</Text>
        <Text style={{paddingBottom: 5, fontSize: 13}}>Make sure you dont leave any spaces or extra characters.</Text>
        <TextInput
          style={{ borderRadius: 10, backgroundColor: '#fff', padding: 7, fontSize: 17, height: 35, width: 300 }}
          onChangeText={text => onTokenChange(text)}
          autoCorrect={false}
          value={token}
          placeholder="XXXXX"
        />
        <LongButton title='Done' disabled={domain === '' || token === ''} color='#edfff9' onPress={() => setup(domain, token)} />
      </View>
    </View>
  )
}