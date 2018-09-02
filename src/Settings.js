import React from 'react';
import { Alert, Modal, StyleSheet, TextInput, View, Button } from 'react-native';
import {getUserSettings, setUserSettings} from './services/userSettings'

export default class SettingsModal extends React.Component {
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
      this.props.closeModal();
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בשמירת הנתונים')
    }
  }

  render() {
    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={this.props.visible}
            onRequestClose={() => {
            return true
            }}>
            <View style={styles.modal}>
                <TextInput
                  style={{height: 40}}
                  placeholder="הכנס שם"
                  value={this.state.name}
                  onChangeText={(text) => this.setState({name: text})}
                />
                <TextInput
                  style={{height: 40}}
                  placeholder="הכנס כתובת"
                  value={this.state.address}
                  onChangeText={(text) => this.setState({address: text})}
                />
                <Button
                  styles={styles.button}
                  title='Save'
                  onPress={() => this.saveSettings()}
                />
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: 'red'
  },
  modal: {
    margin: 70,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    marginTop: 22
  },
});
