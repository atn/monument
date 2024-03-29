import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, TouchableOpacity, SafeAreaView, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { makeApiRequest } from '../utils/rest.util'
import { Ionicons } from '@expo/vector-icons'

import BottomSheet from 'reanimated-bottom-sheet'

import { TodoCell } from './TodoCell'
import { NotificationCell } from './NotificationCell'

const noAssignments = ['You\'re free! No assignments left 🎉',  'Nothing to see here, relax 😎', 'You cleared your todo list, somehow 😳', 'Woohoo! you have no assignments 🎊']

export function Todo() {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  const [assignments, storeApi] = useState([])
  const [no, setNo] = useState('')
  const [refreshing, setRefresh] = useState(false)
  const missing = React.useRef<BottomSheet>(null);

  useEffect(() => {
    try {
      fetchUser()
      setNo(noAssignments[Math.floor(Math.random() * noAssignments.length)])
      storeApi(state.todo_cache)
      setTimeout(() => fetchAPI(), 100)
    } catch (err) {
      alert(err.toString())
    }
  }, [])

  function fetchAPI() {
    setRefresh(true)
    makeApiRequest('/users/self/todo', state)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server responded with error ${res.status} (${res.type})`)
        }
        res.json().then((json) => {
          if (json) {
            const sorted = json.sort(function(a, b) {
              const dateA = new Date(a.assignment.due_at)
              const dateB = new Date(b.assignment.due_at)
              return dateA.getTime() - dateB.getTime()
            });
            
            dispatch({type: 'SETTODOCACHE', value: sorted})
            storeApi(sorted)
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
        if (!res.ok) {
          fetchUser()
          throw new Error(`Server responded with error ${res.status} (${res.type})`)
        }
        res.json().then((json) => {
          if (json) return dispatch({
            type: 'SETUSER',
            value: json
          })
        })
      })
    makeApiRequest('/courses', state)
      .then(res => {
        if (!res.ok) {
          fetchUser()
          throw new Error(`Server responded with error ${res.status} (${res.type})`)
        }
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
    <SafeAreaView style={{flexGrow: 1, margin: 17, paddingBottom: 10}}>
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
        {assignments.length > 0 ? 
          (<FlatList style={{}} refreshing={refreshing} onRefresh={() => {setRefresh(true); fetchAPI()}} showsVerticalScrollIndicator={false} data={assignments} renderItem={renderItem} keyExtractor={(item: any) => item.assignment.id || item.assignment.quiz_id} />)
          :
          (
            <>
              <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600'}}>{no}</Text>
              <Button title={(refreshing ? 'Loading...' : 'Refresh Todo')} disabled={refreshing} onPress={() => fetchAPI()}/>
            </>
          )
        }
    </SafeAreaView>
    </>    
    )
}

// notifications

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
    makeApiRequest('/users/self/missing_submissions?filter%5B%5D=submittable&include%5B%5D=planner_overrides&page=1&per_page=1000', state).then((res) => {res.json().then(async (json) => {
        let hasOverdue: boolean
        let overdueAssignments = []
        // if dismissed (bc canvas api is bad)
        for (let thing of json) {
          if (thing.planner_override === null) continue;
          if (!thing.planner_override.dismissed) {
            hasOverdue = true
            overdueAssignments.push(thing)
            continue;
          }
        }
        
        if (hasOverdue) dispatch({ type: 'SETOVERDUE', value: true })
        else dispatch({ type: 'SETOVERDUE', value: false })
        storeApi(overdueAssignments)
        setRefresh(false)
    })})
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