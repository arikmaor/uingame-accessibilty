import React from 'react';
import { Modal, Text, StyleSheet, Alert, View, Button } from 'react-native';
import call from 'react-native-phone-call';
import {verifySmsPermissions, sendDistressSms} from './sms'

import SettingsModal from './SettingsModal'

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

  async sendSms(number) {
    try {
      const result = await sendDistressSms(number)
      if (!result) {
        Alert.alert('הודעה לא נשלחה')
      }
    } catch (error) {
      Alert.alert('שגיאה בשליחת הודעה')
    }
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

    return (
      <View style={styles.container}>
        <SettingsModal
            visible={this.state.modalVisible}
            closeModal={() => this.hideSettingsModal()}
        />
        <View style={styles.subContainer}>
          <Button
            styles={styles.button}
            title='call Police'
            onPress={() => {
              call({
                number: '100',
                prompt: false
              })
            }}
          />
          <Button
            styles={styles.button}
            title='sms Police'
            onPress={() => this.sendSms('100')}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            styles={styles.button}
            title='Ambulance'
            onPress={() => {
              call({
                number: '101'
              })
            }}
          />
          <Button
            styles={styles.button}
            title='sms Ambulance'
            onPress={() => this.sendSms('101')}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            styles={styles.button}
            title='Fire'
            onPress={() => {
              call({
                number: '102'
              });
            }}
          />
          <Button
            styles={styles.button}
            title='sms Fire'
            onPress={() => this.sendSms('102')}
          />
        </View>
        <Button
          styles={styles.button}
          title='Show Settings'
          onPress={() => {
            this.showSettingsModal();
          }}
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
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    margin: 10,
    color: 'red'
  }
});
