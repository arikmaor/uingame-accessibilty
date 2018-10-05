import React from 'react';
import PropTypes from 'prop-types'
import { Text, StyleSheet, Alert, View, ActivityIndicator, TouchableHighlight } from 'react-native';
import Button from './components/Button'
import {sendDistressSms, DEFAULT_MESSAGE} from './services/sms'
import call from './services/call'
import { TextInput } from 'react-native-gesture-handler';

const EMERGENCY_NUMBERS = [{
  title: 'כיבוי אש',
  phone: '102',
  sms: '0505960735'
}, {
  title: 'מד״א',
  phone: '101',
  sms: '0527000101'
}, {
  title: 'משטרה',
  phone: '100',
  sms: '0522020100'
}]

export default class MainScreen extends React.Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    location: PropTypes.string,
    settings: PropTypes.object
  }

  state = {
    message: DEFAULT_MESSAGE
  }

  static getDerivedStateFromProps(props) {
    if (props.settings.customMessage) {
      return {
        message: `${DEFAULT_MESSAGE}\n${props.settings.customMessage}`
      }
    }
    return null
  }

  sendSms = async (...numbers) => {
    try {
      const result = await sendDistressSms(
        numbers,
        this.props.settings.name,
        this.props.settings.address,
        this.props.location,
        this.state.message
      )
      if (!result) {
        Alert.alert('הודעה לא נשלחה')
      }
    } catch (error) {
      Alert.alert('שגיאה בשליחת הודעה')
    }
  }

  render() {
    const {isDeaf} = this.props.settings
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>קריאת מצוקה</Text>
        </View>
        {isDeaf && (
          <View>
            <TextInput
              style={styles.input}
              placeholder={DEFAULT_MESSAGE}
              value={this.state.message}
              multiline
              onChangeText={(text) => this.setState({message: text})}
            />
          </View>
        )}
        <View style={styles.buttonsLine}>
          <TouchableHighlight onPress={() => isDeaf ? this.sendSms(EMERGENCY_NUMBERS[0].sms) : call(EMERGENCY_NUMBERS[0].phone)} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>{EMERGENCY_NUMBERS[0].title}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => isDeaf ? this.sendSms(EMERGENCY_NUMBERS[1].sms) : call(EMERGENCY_NUMBERS[1].phone)} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>{EMERGENCY_NUMBERS[1].title}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonsLine}>
          <TouchableHighlight onPress={() => isDeaf ? this.sendSms(EMERGENCY_NUMBERS[2].sms) : call(EMERGENCY_NUMBERS[2].phone)} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>{EMERGENCY_NUMBERS[2].title}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => !this.props.settings.contactPhone ? Alert.alert('לא הוזן איש קשר במסך ההגדרות') : isDeaf ? this.sendSms(this.props.settings.contactPhone) : call(this.props.settings.contactPhone)} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>איש קשר</Text>
            </View>
          </TouchableHighlight>
        </View>
        <Text>
          מיקום נוכחי:{'\n'}
          {this.props.location}
        </Text>
        {!this.props.location && <ActivityIndicator />}
        <Button
          title='עדכון פרטים'
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
    justifyContent: 'space-between'
  },
  headerContainer: {
    alignSelf: 'center',
  },
  header: {
    fontWeight: 'bold'
  },
  buttonsLine: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    elevation: 4,
    backgroundColor: '#000493',
    borderRadius: 2,
    height: 80,
    width: 80,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 8,
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    paddingBottom: 10
  }
});
