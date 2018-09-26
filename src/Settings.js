import React from 'react';
import PropTypes from 'prop-types'
import {Alert, StyleSheet, TextInput, View, ActivityIndicator, Picker, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Button from './components/Button'
import {getUserSettings, setUserSettings} from './services/userSettings'
import {getCurrentLocation, verifyLocationPermissions} from './services/location'

export default class SettingsModal extends React.Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired
  }
  state = {
    settingLocation: false,
    settings: {
      isDeaf: false,
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
          <View style={styles.pickerContainer}>
            <Text>
              סוג הבעיה:
            </Text>
            <Picker
              selectedValue={!!this.state.settings.isDeaf}
              style={styles.picker}
              onValueChange={val => this.setSetting('isDeaf', val)}
            >
              <Picker.Item label="בעל לקות ראייה" value={false} />
              <Picker.Item label="כבד שמיעה" value={true} />
            </Picker>
          </View>
          { this.state.settings.isDeaf && (
            <React.Fragment>
              <TextInput
                style={styles.input}
                placeholder="הכנס שם"
                value={this.state.settings.name}
                onChangeText={(text) => this.setSetting('name', text)}
              />
              <View style={styles.addressContainer}>
                <TextInput
                  style={styles.flexInput}
                  placeholder="הכנס כתובת מגורים"
                  editable={!this.state.settingLocation}
                  value={this.state.settings.address}
                  onChangeText={(text) => this.setSetting('address', text)}
                />
                {this.state.settingLocation ? <ActivityIndicator /> : <Ionicons onPress={this.useCurrentLocation} name="md-compass" size={32} color="green" />}
              </View>
              <TextInput
                style={styles.input}
                placeholder="הכנס שם איש קשר"
                value={this.state.settings.contactName}
                onChangeText={(text) => this.setSetting('contactName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="הכנס טלפון"
                value={this.state.settings.contactPhone}
                onChangeText={(text) => this.setSetting('contactPhone', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="הכנס שם איש קשר נוסף"
                value={this.state.settings.contactName2}
                onChangeText={(text) => this.setSetting('contactName2', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="הכנס טלפון"
                value={this.state.settings.contactPhone2}
                onChangeText={(text) => this.setSetting('contactPhone2', text)}
              />
            </React.Fragment>
          )}
          <Button
            title='Save'
            disabled={this.state.settings.isDeaf && !this.state.settings.name}
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
  input: {
    height: 40
  },
  flexInput: {
    height: 40,
    flex: 1
  },
  pickerContainer: {
    flexDirection: "row-reverse",
    alignItems: 'center',
    justifyContent: 'center'
  },
  picker: {
    flex: 1
  },
  addressContainer: {
    flexDirection: 'row-reverse'
  }
});
