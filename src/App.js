import React from 'react';
import {StyleSheet, Text, Alert, View, Modal} from 'react-native';
import {ScreenOrientation} from 'expo'
import {verifySmsPermissions} from './services/sms'
import {getUserSettings} from './services/userSettings'
import {verifyLocationPermissions, getCurrentLocation} from './services/location'

import MainScreen from './MainScreen'
import Settings from './Settings'

export default class App extends React.Component {
  state = {
    settings: {},
    settingsVisible: false,
    verifingPermission: true,
    location: null
  };

  constructor(props) {
    super(props)
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP)
    this.init()
  }

  init = async () => {
    console.log('initializing...')
    try {
      await verifySmsPermissions()
      await verifyLocationPermissions()
      this.setState({verifingPermission: false})
    } catch (error) {
      Alert.alert('שגיאה בקבלת הרשאות')
    }

    const settings = await getUserSettings()
    this.setState({
      settings,
      settingsVisible: !settings.name
    })

    try {
      const location = await getCurrentLocation()
      this.setState({location})
    } catch (error) {
      this.setState({location: 'שגיאה'})
    }
  }

  openSettings = () => {
    this.setState({settingsVisible: true});
  }

  closeSettings = async () => {
    const settings = await getUserSettings()
    this.setState({
      settings,
      settingsVisible: false
    });
  }

  render() {
    const {settings, settingsVisible, verifingPermission, location} = this.state

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
        <MainScreen settings={settings} location={location} openSettings={this.openSettings}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
})
