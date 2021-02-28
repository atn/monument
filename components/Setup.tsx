import React, { useState } from 'react'
import { Text, View, TextInput, SafeAreaView } from 'react-native'
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
    <SafeAreaView>
      <View style={{margin: 17}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Setup ⛩</Text>
        <Text style={{fontWeight: 'bold', paddingBottom: 5, fontSize: 18}}>Hey! Ready to setup monument?</Text>
        <Text style={{paddingBottom: 5, fontSize: 13}}>All of your information is stored locally🔒</Text>
        <Text style={{fontWeight: 'bold', paddingBottom: 5, paddingTop: 20, fontSize: 18}}>What's your schools Canvas domain name?</Text>
        <Text style={{paddingBottom: 5, fontSize: 13}}>Usually, it's similar to "your-school.instructure.com"</Text>
        <TextInput
          style={{ borderRadius: 10, backgroundColor: '#fff', padding: 7, fontSize: 17, height: 35, width: 320 }}
          onChangeText={text => onChangeDomain(text)}
          value={domain}
          autoFocus={true}
          autoCorrect={false}
          placeholder="example.com"
        />
        <Text style={{fontWeight: 'bold', paddingBottom: 5, paddingTop: 30, fontSize: 18}}>Nice, paste your canvas authorization token here.</Text>
        <Text style={{paddingBottom: 5, fontSize: 13}}>You can get this from your canvas profile settings, under "Approved Integrations"</Text>
        <TextInput
          style={{ borderRadius: 10, backgroundColor: '#fff', padding: 7, fontSize: 17, height: 35, width: 320 }}
          onChangeText={text => onTokenChange(text)}
          autoCorrect={false}
          value={token}
          placeholder="XXXXX"
        />
        <LongButton title='Done' disabled={domain === '' || token === ''} color='#edfff9' onPress={() => setup(domain, token)} />
      </View>
    </SafeAreaView>
  )
}