import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { useSelector, useDispatch, Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from './store'

import { Setup } from './components/Setup'
import { Todo } from './components/TodoList'
import { Inbox } from './components/Inbox'

const Tabs = createBottomTabNavigator()

function App() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  useEffect(() => {
    AsyncStorage.getItem('canvas-auth').then((key) => dispatch({type: 'SETTOKEN', value: key}))
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
  const store = useStore()
  return (
  <Provider store={store}>
    <App/>
  </Provider>
  )
}