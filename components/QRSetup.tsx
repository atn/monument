import React, { useState } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { LongButton } from './LongButton'
import { useDispatch } from 'react-redux'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { loginWithQR } from '../utils/rest.util';

import AsyncStorage from '@react-native-async-storage/async-storage'

export function QRSetup({navigation}) {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch()

  function setup(domain: string, refresh_token: string, token: string) {
    dispatch({type: 'SETDOMAIN', value: domain.toLowerCase()})

    AsyncStorage.setItem('auth-type', 'qr')
    AsyncStorage.setItem('canvas-refresh', refresh_token)
    AsyncStorage.setItem('canvas-auth', token)
    AsyncStorage.setItem('canvas-domain', domain.toLowerCase())
    dispatch({type: 'SETTOKEN', value: token})
  }

  // Start QR session
  async function startQRSession() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') return alert('Camera access not granted')
    setHasPermission(status === 'granted');
  }
  
  async function handleBarCodeScanned({type, data}) {
    // If code isn't correct URL
    if (!data.includes('https://sso.canvaslms.com/canvas/login?')) {
      setHasPermission(false)
      return setScanned(false)
    }

    setScanned(true)

    const code = data.split('&code=')[1].split('&domain=')
    const res = await loginWithQR(code[0], code[1])
    // if oAuth request didn't go through
    if (res.error) {
      alert('Invalid QR Code')
      setHasPermission(false)
      return setScanned(false)
    }

    setup(code[1], res.refresh_token, res.access_token)
  }

  return (
    <>
    {scanned && <Button title='Tap to Scan Again' onPress={() => setScanned(false)} />}
      {hasPermission ? (
        <>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
        <SafeAreaView style={{ marginRight: 20, alignSelf: 'flex-end', position: 'absolute',}}>
          <LongButton color='#e8e8e8' title="Close" onPress={() => setHasPermission(false)} />
        </SafeAreaView>
        </BarCodeScanner>
        </>
      ) : (
        <SafeAreaView>
        <View style={{margin: 17}}>
          <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>QR Setup</Text>
          <Text style={{fontWeight: 'bold', paddingBottom: 5, fontSize: 18}}>Hey! Ready to setup monument?</Text>
          <Text style={{fontSize: 13}}>Press the button below to scan your Canvas QR Code.</Text>
          <LongButton title='Scan QR Code' color='#edfff9' onPress={() => startQRSession()} />
          <Text style={{paddingTop: 7}}>You can find this on your canvas profile, under "QR For Mobile Login"</Text>
        </View>
        </SafeAreaView>
        )}
    </>
  )
}