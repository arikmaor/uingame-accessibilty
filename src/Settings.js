import React from 'react';
import PropTypes from 'prop-types'
import {Alert, StyleSheet, TextInput, View, Button, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
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
      address: '',
      contactName: '',
      contactPhone: '',
      contactName2: '',
      contactPhone2: '',
    }
  }

  constructor(props) {
    super(props);
    this.loadSettings();
  }

  loadSettings = async () => {
    const settings = await getUserSettings()
    this.setState({settings})
  }

  saveSettings = async () => {
    try {
      await setUserSettings(this.state.settings)
      this.props.closeSettings();
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בשמירת הנתונים')
    }
  }

  useCurrentLocation = async () => {
    this.setState({settingLocation: true})
    try {
      const hasPermission = await verifyLocationPermissions()
      if (hasPermission) {
        const address = await getCurrentLocation()
        this.setSetting('address', address)
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בגישה לנתוני מיקום')
    }
    this.setState({settingLocation: false})
  }

  setSetting = (key, val) => {
    this.setState({
      settings: {
        ...this.state.settings,
        [key]: val
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
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
          <TextInput
            style={{height: 40}}
            placeholder="הכנס שם איש קשר"
            value={this.state.settings.contactName}
            onChangeText={(text) => this.setSetting('contactName', text)}
          />
          <TextInput
            style={{height: 40}}
            placeholder="הכנס טלפון"
            value={this.state.settings.contactPhone}
            onChangeText={(text) => this.setSetting('contactPhone', text)}
          />
          <TextInput
            style={{height: 40}}
            placeholder="הכנס שם איש קשר נוסף"
            value={this.state.settings.contactName2}
            onChangeText={(text) => this.setSetting('contactName2', text)}
          />
          <TextInput
            style={{height: 40}}
            placeholder="הכנס טלפון"
            value={this.state.settings.contactPhone2}
            onChangeText={(text) => this.setSetting('contactPhone2', text)}
          />
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
