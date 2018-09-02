import {Permissions, SMS} from 'expo'
import {getUserSettings} from './userSettings'

export async function verifySmsPermissions() {
  try {
    console.log('Checking sms permissions...')
    const { status } = await Permissions.askAsync(Permissions.SMS);
    console.log(`SMS permission status: ${status}`)
    return status === 'granted'
  } catch (error) {
    console.error('Error verifing sms permissions ' + error)
  }
}

export async function sendDistressSms(phoneNumber) {
  const {name, address} = await getUserSettings()
  try {
    console.log(SMS)
    const {result} = await SMS.sendSMSAsync(phoneNumber, "שלום, שמי " + name + '\nאני זקוק לעזרה בכתובת ' + address)
    return result === 'sent'
  } catch (error) {
    console.error(`Error sending sms to '${phoneNumber}' ` + error)
    throw error
  }
}
