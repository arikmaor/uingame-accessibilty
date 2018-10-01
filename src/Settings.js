import React from 'react';
import PropTypes from 'prop-types'
import {Alert, StyleSheet, TextInput, View, Picker, Text} from 'react-native';
import Button from './components/Button'
import {getUserSettings, setUserSettings} from './services/userSettings'

export default class SettingsModal extends React.Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired
  }
  state = {
    settings: {
      isDeaf: false,
      name: '',
      address: '',
      contactName: '',
      contactPhone: '',
      customMessage: ''
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
          <View style={styles.headerContainer}>
            <Text style={styles.header}>הגדרת פרטים אישיים</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Text>
              סוג הלקות:
            </Text>
            <Picker
              selectedValue={!!this.state.settings.isDeaf}
              style={styles.picker}
              onValueChange={val => this.setSetting('isDeaf', val)}
            >
              <Picker.Item label="לקות ראייה" value={false} />
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
              <TextInput
                style={styles.input}
                placeholder="הכנס כתובת מגורים"
                value={this.state.settings.address}
                onChangeText={(text) => this.setSetting('address', text)}
              />
            </React.Fragment>
          )}
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
          { this.state.settings.isDeaf && (
            <TextInput
              style={styles.input}
              placeholder="פרטים קבועים שישלחו בהודעה"
              multiline
              value={this.state.settings.customMessage}
              onChangeText={(text) => this.setSetting('customMessage', text)}
            />
          )}
          <Button
            title='שמור'
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
    justifyContent: 'space-between'
  },
  headerContainer: {
    alignSelf: 'center',
  },
  header: {
    fontWeight: 'bold'
  },
  input: {
    paddingBottom: 10
  },
  pickerContainer: {
    flexDirection: 'row',
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
