import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser';
import { View, Modal, Text, StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { styles } from '../styles'
import HTML from 'react-native-render-html';
import { makeApiRequest } from '../utils/rest.util'

import { LongButton } from './LongButton'
import { dateTimeFormat } from './TodoList';
import { ScrollView } from 'react-native-gesture-handler';

type props = {
  isShowing: boolean,
  assignment: any,
  close: any,
}

export function AssignmentModal(props: props) {
  const state = useSelector((state: any) => state)
  const [ shouldHideStatusBar, setStatusBar ] = useState(false)
  return (
    <Modal
      visible={props.isShowing}
      animationType="slide"
      presentationStyle={"pageSheet"}
    >
      <StatusBar hidden={shouldHideStatusBar} animated />
      <View style={{padding: 20}}>
        <View style={{ padding: 20, paddingTop: 10, alignSelf: 'flex-end', position: 'absolute',}}>
          <LongButton color='#e8e8e8' title="Close" onPress={() => props.close()} />
        </View>
        <View style={{marginTop: 30}}>
          <Text style={{fontSize: 15, fontWeight: '600'}}>Due {dateTimeFormat.format(new Date(props.assignment.due_at))}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.assignment.name}</Text>
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <HTML source={{html: props.assignment.description || "No Description"}}></HTML>
          </ScrollView>
        </View>
      </View>
      <View style={styles.bottom}>
        <LongButton  color='#00C781' onPress={() => openAssignment(props.assignment.html_url, state, () => setStatusBar(true))} title="Open in Browser"/>
      </View>
    </Modal>
  )
}

function openAssignment(url: string, state: any, statusBar: () => void) {
  makeApiRequest(`/login/session_token?return_to=${url}`, state).then(res => res.json().then((json) => {
    statusBar()
    WebBrowser.openBrowserAsync(json.session_url , { dismissButtonStyle: 'close' })
  }))
};