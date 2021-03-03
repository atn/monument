import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { makeApiRequest } from '../utils/rest.util'
import { Ionicons } from '@expo/vector-icons'

import BottomSheet from 'reanimated-bottom-sheet'

import { TodoCell } from './TodoCell'
import { NotificationCell } from './NotificationCell'

export const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

export const todayFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
});

export function Todo() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  const [assignments, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const missing = React.useRef<BottomSheet>(null);

  useEffect(() => {
    try {
      setRefresh(true)
      fetchAPI()
      fetchUser()
    } catch (err) {
      alert(err.toString())
    }
  }, [])

  function fetchAPI() {
    makeApiRequest('/users/self/todo', state)
      .then(res => {
        if (!res.ok) return alert(`Server responded with error ${res.status} (${res.type})`)
        res.json().then((json) => {
          if (json) {
            storeApi(json)
            return setRefresh(false)
          }
          storeApi([])
          return setRefresh(false)
        })
      })
  }

  function fetchUser() {
    makeApiRequest('/users/self', state)
      .then(res => {
        if (!res.ok) return alert(`Server responded with error ${res.status} (${res.type})`)
        res.json().then((json) => {
          if (json) return dispatch({
            type: 'SETUSER',
            value: json
          })
        })
      })
    makeApiRequest('/courses', state)
      .then(res => {
        if (!res.ok) return alert(`Server responded with error ${res.status} (${res.type})`)
        res.json().then((json) => {
          if (json) return dispatch({
            type: 'SETCOURSES',
            value: json
          })
        })
      })
  }

  function renderNotifs() {
    return (
      <Notifications />
    )
  }

  return (
    <>
      <BottomSheet
        ref={missing}
        snapPoints={[-100, 400]}
        renderContent={renderNotifs}
      />
    <SafeAreaView style={{margin: 17, marginBottom: 70}}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
          <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 10}}>Todo</Text>
        </View>
        {state.overdueAssignments && 
          <TouchableOpacity style={{marginLeft: 'auto', alignSelf: 'center'}}  onPress={() => (missing as any).current.snapTo(1)} >
            <Ionicons name='alert-circle' size={30} color='red' />
          </TouchableOpacity>
        }
      </View>
        {assignments &&
          <FlatList style={{}} refreshing={refreshing} onRefresh={() => fetchAPI()} showsVerticalScrollIndicator={false} data={assignments} renderItem={renderItem} keyExtractor={(item: any) => item.assignment.id || item.assignment.quiz_id} />
        }
    </SafeAreaView>
    </>
    )
}

function Notifications() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  const [notifications, storeApi] = useState([])
  const [refreshing, setRefresh] = useState(false)

  useEffect(() => {
    setRefresh(true)
    fetchNotifications()
  }, [])

  function fetchNotifications() {
    makeApiRequest('/users/self/missing_submissions?filter%5B%5D=submittable&include%5B%5D=planner_overrides', state).then((res) => res.json().then(async (json) => {
      if (typeof json == 'object') {
        let hasOverdue: boolean
        // muted is 
        for (let thing of json) {
          if (!thing.planner_override) {
            hasOverdue = true
            continue
          }
        }
        
        if (hasOverdue) dispatch({ type: 'SETOVERDUE', value: true })
        else dispatch({ type: 'SETOVERDUE', value: false })
        await storeApi(json)
        setRefresh(false)
      }
    }))
  }

  return (
    <View style={{height: 400, backgroundColor: `#fff`, borderColor: '#000', borderBottomWidth: 0, borderWidth: 1, borderRadius: 20, padding: 20 }}>
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingBottom: 10}}>Overdue Assignments</Text>
      {notifications &&
        <FlatList style={{}} refreshing={refreshing} onRefresh={() => fetchNotifications()} showsVerticalScrollIndicator={false} data={notifications} renderItem={renderNotification} keyExtractor={(item: any) => item.id || item.quiz_id} />
      }
    </View>
  )
}

const renderItem = ({ item }: any) => (
  <TodoCell item={item}/>
);

const renderNotification = ({ item }: any) => (
  <NotificationCell item={item} />
)