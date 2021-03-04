import React from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'


export function Attribution() {
  return (
    <View>
      <View style={{alignContent: 'flex-end', paddingTop: 10, flexDirection: 'row'}}>
        <Text>
          an app by 
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://aust.nyc')}>
          <Text style={{color: 'blue', fontWeight: 'bold'}}> austin simon</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{paddingTop: 5}} onPress={() => Linking.openURL('https://aust.nyc/mnmt/privacy')}>
        <Text style={{color: 'teal', fontWeight: 'bold'}}>privacy policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{paddingTop: 5}} onPress={() => Linking.openURL('mailto:austin@astn.me')}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>contact</Text>
      </TouchableOpacity>
    </View>
  )
}