import React from 'react';
import PropTypes from 'prop-types'
import { Alert, StyleSheet, TextInput, View, Button } from 'react-native';
import {getUserSettings, setUserSettings} from './services/userSettings'

export default class SettingsModal extends React.Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired
  }
  state = {
    name: '',
    address: ''
  }

  constructor(props) {
    super(props);
    this.loadSettings();
  }

  async loadSettings() {
    const settings = await getUserSettings()
    this.setState({
      name: settings.name,
      address: settings.address
    })
  }

  async saveSettings() {
    try {
      await setUserSettings(this.state)
      this.props.closeSettings();
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בשמירת הנתונים')
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <TextInput
            style={{height: 40}}
            placeholder="הכנס שם"
            value={this.state.name}
            onChangeText={(text) => this.setState({name: text})}
          />
          <TextInput
            style={{height: 40}}
            placeholder="הכנס כתובת מגורים"
            value={this.state.address}
            onChangeText={(text) => this.setState({address: text})}
          />
          <Button
            styles={styles.button}
            title='Save'
            onPress={() => this.saveSettings()}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly'
  },
  button: {
    backgroundColor: 'red'
  },
});
