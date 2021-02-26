import React, { useEffect } from 'react'
import { StatusBar, View, Text } from 'react-native'
import { useSelector, useDispatch, Provider } from 'react-redux'

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
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  useEffect(() => {
    // this might not be needed
    AsyncStorage.getItem('canvas-auth').then((key) => {
      if (key) {
        dispatch({type: 'SETTOKEN', value: key.replace(/\s/g, '')})
        console.log(key)
      }
    })
    AsyncStorage.getItem('canvas-domain').then((key) => dispatch({type: 'SETDOMAIN', value: key}))
  }, [])
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

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
    <App/>
    </PersistGate>
  </Provider>
  )
}

function Settings() {
  const dispatch = useDispatch()
  function logout() {
    dispatch({type: 'SETTOKEN', value: null})
    dispatch({type: 'SETDOMAIN', value: null})
    AsyncStorage.setItem('canvas-domain', '')
    AsyncStorage.setItem('canvas-auth', '')
  }
  return (
    <View style={{marginTop: 60, marginBottom: 60, margin: 17, borderRadius: 20}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Settings</Text>
      <LongButton onPress={() => logout()} color="#ffbab5" title="Logout"/>
    </View>
  )
}