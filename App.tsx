import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Button, View, Modal, StatusBar} from 'react-native'

export default function App() {
  const [assignments, storeApi] = useState()
  const [showing, setShowing] = useState(false)
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  useEffect(() => {
    fetch("https://halfhollowhills.instructure.com/api/v1/users/self/todo?per_page=100", {
      "headers": {
        "accept": "application/json+canvas-string-ids, application/json",
        "authorization": "Bearer heh"
      },
      "referrer": "https://halfhollowhills.instructure.com/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "mode": "cors",
    }).then(res => res.json().then((json) => {
      storeApi(json)
    }))
  }, [])


    return (
      <View style={{marginTop: 60, margin: 20}}>
        <StatusBar barStyle='dark-content'/>
        <Text style={{fontSize: 15, fontWeight: '600'}}>Canvas</Text>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Todo List</Text>
        {assignments &&
          (assignments as any).map((assignment: any) => (
            <View style={styles.cell} key={assignment.assignment.id || assignment.assignment.quiz_id}>
              <Text style={{fontWeight: 'bold'}}>{assignment.assignment.name}</Text>
              <Text style={{fontSize: 13}}>Due {dateTimeFormat.format(new Date(assignment.assignment.due_at))}</Text>
            </View>
          ))
        }
      <Modal
          animationType="slide"
          visible={showing}
          presentationStyle={"pageSheet"}>
          <View>
            <Button onPress={() => setShowing(false)} title="Close"/>
          </View>
        </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  cell: {
    backgroundColor: '#f4f4f4',
    borderRadius: 9,
    padding: 10,
    margin: 4,
  }
})