import React from 'react';
import { Text, StyleSheet, Alert, View, Button } from 'react-native';
import call from 'react-native-phone-call';
import {verifySmsPermissions, sendDistressSms} from './services/sms'
import {verifyLocationPermissions, getCurrentLocation} from './services/location'

import MainScreen from './MainScreen'
import SettingsModal from './Settings'

export default class App extends React.Component {
  state = {
    modalVisible: false,
    verifingPermission: true
  };

  constructor(props) {
    super(props)
    this.init()
  }

  async init() {
    console.log('initializing...')
    try {
      await verifySmsPermissions()
      await verifyLocationPermissions()
      this.setState({verifingPermission: false})
    } catch (error) {
      Alert.alert('שגיאה בקבלת הרשאות')
    }
  }

  showSettingsModal() {
    this.setState({modalVisible: true});
  }

  hideSettingsModal() {
    this.setState({modalVisible: false});
  }

  render() {
    if (this.state.verifingPermission) {
      return (
        <View>
          <Text>
            אנא אשר שליחת הודעות
          </Text>
        </View>
      )
    }

    return <MainScreen showSettingsModal={this.showSettingsModal}/>
  }
}
