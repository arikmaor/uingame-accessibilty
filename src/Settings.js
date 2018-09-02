import React from 'react';
import PropTypes from 'prop-types'
import {Alert, StyleSheet, TextInput, View, Button, ActivityIndicator, Text, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getUserSettings, setUserSettings} from './services/userSettings'
import {getCurrentLocation, verifyLocationPermissions} from './services/location'
import SelectContactModal from './SelectContact'

export default class SettingsModal extends React.Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired
  }
  state = {
    settingLocation: false,
    settingContact: false,
    settings: {
      name: '',
      address: '',
      contactId: '',
      contactName: '',
      contactPhoneNumberId: '',
      contactPhoneLabel: '',
      contactPhoneNumber: '',
    }
  }

  constructor(props) {
    super(props);
    this.loadSettings();
  }

  async loadSettings() {
    const settings = await getUserSettings()
    this.setState({settings})
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

  openContactModal() {
    this.setState({settingContact: true})
  }

  closeContactModal() {
    this.setState({settingContact: false})
  }

  selectContact(id, name, phoneNumberId, phoneNumber, phoneLabel) {
    console.log(`${id}, ${name}, ${phoneNumberId}, ${phoneNumber}, ${phoneLabel}`)
    this.setState({
      settings: {
        ...this.state.settings,
        contactId: id,
        contactName: name,
        contactPhoneNumberId: phoneNumberId,
        contactPhoneNumber: phoneNumber,
        contactPhoneLabel: phoneLabel,
        settingContact: false
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <Modal
            visible={this.state.settingContact}
            onRequestClose={this.closeContactModal}
          >
            <SelectContactModal closeModal={this.closeContactModal} selectContact={this.selectContact}/>
          </Modal>
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
          <View style={{flexDirection: 'row-reverse'}}>
            <Text style={{height: 40, flex: 1}}>איש קשר: {this.state.settings.contactName} - {this.state.settings.contactPhoneLabel}</Text>
            <Ionicons onPress={this.openContactModal} name="md-contact" size={32} color="green" />
          </View>
          <Button
            styles={styles.button}
            title='Save'
            disabled={!this.state.contactName}
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
