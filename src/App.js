import React from 'react';
import { StyleSheet, Text, Alert, View, Modal } from 'react-native';
import {verifySmsPermissions} from './services/sms'
import {verifyLocationPermissions, getCurrentLocation} from './services/location'

import MainScreen from './MainScreen'
import Settings from './Settings'

export default class App extends React.Component {
  state = {
    settingsVisible: false,
    verifingPermission: true,
    location: null
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

    try {
      const location = await getCurrentLocation()
      this.setState({location})
    } catch (error) {
      this.setState({location: 'שגיאה'})
    }
  }

  openSettings() {
    this.setState({settingsVisible: true});
  }

  closeSettings() {
    this.setState({settingsVisible: false});
  }

  render() {
    const {settingsVisible, verifingPermission, location} = this.state

    if (verifingPermission) {
      return (
        <View style={styles.container}>
          <Text>
            אנא אשר שליחת הודעות
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Modal
          visible={settingsVisible}
          onRequestClose={this.closeSettings}
        >
          <Settings closeSettings={this.closeSettings}/>
        </Modal>
        <MainScreen location={location} openSettings={this.openSettings}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
