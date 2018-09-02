import React from 'react';
import PropTypes from 'prop-types'
import { Text, StyleSheet, Alert, View, Button, ActivityIndicator } from 'react-native';
import call from 'react-native-phone-call';
import {sendDistressSms} from './services/sms'

export default class MainScreen extends React.Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    location: PropTypes.string
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
    return (
      <View style={styles.container}>
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
            title='Sms Fire'
            onPress={() => this.sendSms('102')}
          />
        </View>
        <View style={styles.rtlView}>
          <Text>
            מיקום נוכחי:
          </Text>
          {this.props.location ? <Text>{this.props.location}</Text> : <ActivityIndicator />}
        </View>
        <Button
          styles={styles.button}
          title='Show Settings'
          onPress={() => {
            this.props.openSettings();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl'
  },
  rtlView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  button: {
    margin: 10,
    color: 'red'
  }
});
