import React, { useEffect } from 'react'
import { StatusBar, Text, Platform, SafeAreaView } from 'react-native'
import { useSelector, useDispatch, Provider } from 'react-redux'
import * as Updates from 'expo-updates';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons'
import { PersistGate } from 'redux-persist/integration/react'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistor, store } from './store'

import { Setup } from './components/Setup'
import { Todo } from './components/TodoList'
import { Inbox } from './components/Inbox'
import { LongButton } from './components/LongButton'

const Tabs = createBottomTabNavigator()

function App() {
  if (Platform.OS !== 'ios') return <Text>Unsupported OS</Text>
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  useEffect(() => {
    // this might not be needed
    AsyncStorage.getItem('canvas-auth').then((key) => {
      if (key) dispatch({type: 'SETTOKEN', value: key.replace(/\s/g, '')})
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
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName as any} size={size} color={color} />;
          }
        })}>
          {state.token ? (
            <>
              <Tabs.Screen name="Todo" component={Todo}/>
              <Tabs.Screen name="Inbox" component={Inbox}/>
              <Tabs.Screen name="Settings" component={Settings}/>
            </>
          ) : (
            <>
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
    return
  }

  return (
    <SafeAreaView style={{margin: 17}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 4}}>Settings</Text>
      <Text style={{paddingBottom: 3, fontSize: 18}}>Logged in as <Text style={{fontWeight: 'bold'}}>{state.user.short_name}</Text></Text>
      <Text>enrolled in <Text style={{fontWeight: 'bold'}}>{state.courses.length}</Text> course{state.courses.length > 1 ? 's' : ''}</Text>
      <Text>on domain <Text style={{fontWeight: 'bold'}}>{state.domain}</Text></Text>
      <LongButton onPress={() => logout()} color="#ffbab5" title="Logout"/>
      <LongButton onPress={() => checkForUpdate()} color="#ccfff0" title="Check for updates"/>
      <LongButton onPress={() => clearCache()} color="#fbffab" title="Clear Cache"/>
    </SafeAreaView>
  )
}

async function checkForUpdate() {
  const res = await Updates.checkForUpdateAsync()
  if (res.isAvailable) Updates.reloadAsync()
}