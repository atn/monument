import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser';
import { View, Modal, Text, StatusBar } from 'react-native'
import { styles } from '../styles'
import HTML from "react-native-render-html";

import { LongButton } from './LongButton'

type props = {
  isShowing: boolean,
  assignment: any,
  close: any,
}

export function AssignmentModal(props: props) {
  const [shouldHideStatusBar, hideStatusBar] = useState(false)
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
          <Text style={{fontSize: 15, fontWeight: '600'}}>{props.assignment.locked_for_user ? "Locked" : "Unlocked"}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.assignment.name}</Text>
          <HTML source={{html: props.assignment.description || "No Description"}}></HTML>
        </View>
      </View>
      <View style={styles.bottom}>
        <LongButton  color='#00C781' onPress={() => openAssignment(props.assignment.html_url, () => hideStatusBar(true))} title="Submit"/>
      </View>
    </Modal>
  )
}

function openAssignment(url: string, statusBar: () => void) {
  statusBar()
  WebBrowser.openBrowserAsync(url);
};