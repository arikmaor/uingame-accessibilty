import React from 'react';
import PropTypes from 'prop-types'
import { Alert, StyleSheet, TextInput, View, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {getUserSettings, setUserSettings} from './services/userSettings'
import {getCurrentLocation, verifyLocationPermissions} from './services/location'

export default class SettingsModal extends React.Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired
  }
  state = {
    settingLocation: false,
    settings: {
      name: '',
      address: ''
    }
  }

  constructor(props) {
    super(props);
    this.loadSettings();
  }

  async loadSettings() {
    const {name, address} = await getUserSettings()
    this.setState({
      settings: {
        name,
        address
      }
    })
  }

  async saveSettings() {
    try {
      await setUserSettings(this.state.settings)
      this.props.closeSettings();
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בשמירת הנתונים')
    }
  }

  async useCurrentLocation() {
    this.setState({settingLocation: true})
    try {
      const hasPermission = await verifyLocationPermissions()
      if (hasPermission) {
        const address = await getCurrentLocation()
        this.setState({settings: {
          ...this.state.settings,
          address
        }})
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בגישה לנתוני מיקום')
    }
    this.setState({settingLocation: false})
  }

  async setSetting(key, val) {
    this.setState({
      settings: {
        [key]: val
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
          {/* <Modal
            visible={settingsVisible}
            onRequestClose={this.closeSettings}
          >
            <View>lala</View>
          </Modal> */}
          <TextInput
            style={{height: 40}}
            placeholder="הכנס שם"
            value={this.state.settings.name}
            onChangeText={(text) => this.setSetting('name', text)}
          />
          <View style={{flexDirection: 'row-reverse'}}>
            <TextInput
              style={{height: 40, flex: 1}}
              placeholder="הכנס כתובת מגורים"
              editable={!this.state.settingLocation}
              value={this.state.settings.address}
              onChangeText={(text) => this.setSetting('address', text)}
            />
            {this.state.settingLocation ? <ActivityIndicator /> : <Ionicons onPress={this.useCurrentLocation} name="md-compass" size={32} color="green" />}
          </View>
          <Button
            styles={styles.button}
            title='Save'
            disabled={!this.state.settings.name}
            onPress={this.saveSettings}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly'
  },
  button: {
    backgroundColor: 'red'
  },
});
