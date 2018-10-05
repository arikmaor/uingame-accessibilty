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

export async function sendDistressSms(phoneNumbers, name, address, location, message) {
  const filterredPhoneNumbers = phoneNumbers.filter(x => !!x)
  try {
    console.log('sending SMS to ' + filterredPhoneNumbers)
    const {result} = await SMS.sendSMSAsync(filterredPhoneNumbers, `
      ${message || DEFAULT_MESSAGE}
      שם: ${name}
      מיקום נוכחי: ${location}
      כתובת מגורים: ${address}
    `.trim())
    return result === 'sent'
  } catch (error) {
    console.error(`Error sending sms to '${filterredPhoneNumbers}' ` + error)
    throw error
  }
}
