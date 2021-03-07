import React, { useEffect } from 'react'
import { AppState, StatusBar, Text, Platform, SafeAreaView } from 'react-native'
import { useSelector, useDispatch, Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons'

import { persistor, store } from './store'

import { getNewToken } from './utils/rest.util'

import { QRSetup } from './components/QRSetup'
import { Setup } from './components/Setup'
import { Todo } from './components/TodoList'
import { Inbox } from './components/Inbox'
import { Attribution } from './components/Attribution'
import { Chat } from './components/chat/Chat'
import { LongButton } from './components/LongButton'

const Tabs = createBottomTabNavigator()

function App() {
  if (Platform.OS !== 'ios') return <Text>Unsupported OS</Text>
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  useEffect(() => {
    // need this b/c redis doesn't persist sometimes
    AsyncStorage.getItem('canvas-auth').then((key) => {
      if (key) dispatch({type: 'SETTOKEN', value: key.replace(/\s/g, '')})
    })
    AsyncStorage.getItem('auth-type').then((key) => {
      if (key === 'qr') {
        (async () => {
          const refresh = await AsyncStorage.getItem('canvas-refresh')
          dispatch({type: 'SETREFRESH', value: refresh})
          const token = await getNewToken(refresh, state.domain)
          if (token.error) return alert('Error getting access token. Please logout.')
          dispatch({type: 'SETTOKEN', value: token.access_token})
        })()
      }
    })
    AsyncStorage.getItem('canvas-domain').then((key) => dispatch({type: 'SETDOMAIN', value: key}))
  }, [])
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Todo':
                iconName='list'
                break;
              case 'Inbox':
                iconName='mail'
                break;
              case 'Settings':
                iconName='cog'
                break;
              case 'Setup':
                iconName='construct'
                break;
              case 'QR Setup':
                iconName='qr-code'
                break;
              case 'Chat':
                iconName='chatbubbles'
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName as any} size={size} color={color} />;
          }
        })}>
          {state.token ? (
            <>
              <Tabs.Screen name="Todo" component={Todo}/>
               <Tabs.Screen name="Inbox" component={Inbox}/>
               {false &&
                <Tabs.Screen name="Chat" component={Chat}/>
               }
              <Tabs.Screen name="Settings" component={Settings}/>
            </>
          ) : (
            <>
              <Tabs.Screen name="QR Setup" component={QRSetup}/>
              <Tabs.Screen name="Setup" component={Setup}/>
            </>
          )}
      </Tabs.Navigator>
      <StatusBar barStyle='dark-content'/>
    </NavigationContainer>
  )   
}

export default function Index() {
  return (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>
  )
}

function Settings() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)

  function logout() {
    dispatch({type: 'SETTOKEN', value: null})
    dispatch({type: 'SETDOMAIN', value: null})
    dispatch({type: 'SETUSER', value: {}})
    AsyncStorage.setItem('canvas-domain', '')
    AsyncStorage.setItem('canvas-auth', '')
  }

  function clearCache() {
    return alert('this button does nothing ')
  }

  return (
    <SafeAreaView style={{margin: 17}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 4}}>Settings</Text>
      <Text style={{paddingBottom: 3, fontSize: 18}}>Logged in as <Text style={{fontWeight: 'bold'}}>{state.user.short_name}</Text></Text>
      <Text>enrolled in <Text style={{fontWeight: 'bold'}}>{state.courses.length}</Text> course{state.courses.length > 1 ? 's' : ''}</Text>
      <Text>on domain <Text style={{fontWeight: 'bold'}}>{state.domain}</Text></Text>
      <LongButton onPress={() => logout()} color="#ffbab5" title="Logout"/>
      <LongButton onPress={() => clearCache()} color="#fbffab" title="Clear Cache"/>
      <Attribution />
    </SafeAreaView>
  )
}