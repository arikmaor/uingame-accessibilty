import React from 'react';
import PropTypes from 'prop-types'
import { Text, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
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
    message: ''
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
        {isDeaf && (
          <View>
            <TextInput
              style={styles.input}
              placeholder={DEFAULT_MESSAGE}
              value={this.state.message}
              onChangeText={(text) => this.setState({message: text})}
            />
          </View>
        )}
        <View style={styles.rtlView}>
          {EMERGENCY_NUMBERS.map((item, idx) => (
            <Button
              key={idx}
              styles={styles.button}
              title={item.title}
              onPress={() => isDeaf ? this.sendSms(item.sms) : call(item.phone)}
            />
          ))}
        </View>
        { isDeaf && (this.props.settings.contactPhone || this.props.settings.contactPhone2) && (
          <View>
            <Button
              styles={styles.button}
              title='איש קשר'
              onPress={() => this.sendSms(this.props.settings.contactPhone, this.props.settings.contactPhone2)}
            />
          </View>
        )}
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
    justifyContent: 'space-evenly'
  },
  rtlView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  input: {
    height: 40
  }
});
