import {Permissions, SMS} from 'expo'

export const DEFAULT_MESSAGE = "אני זקוק לעזרה"

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

export async function sendDistressSms(phoneNumber, name, address, location, message) {
  try {
    console.log('sending SMS to ' + phoneNumber)
    const {result} = await SMS.sendSMSAsync(phoneNumber, `
      שם: ${name}
      מיקום נוכחי: ${location}
      כתובת מגורים: ${address}
      ${message || DEFAULT_MESSAGE}
    `.trim())
    return result === 'sent'
  } catch (error) {
    console.error(`Error sending sms to '${phoneNumber}' ` + error)
    throw error
  }
}
