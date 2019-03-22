import {SMS} from 'expo'

export const DEFAULT_MESSAGE = "אני זקוק לעזרה"

export async function sendDistressSms(phoneNumbers, name, address, location, message) {
  const filterredPhoneNumbers = phoneNumbers.filter(x => !!x)
  try {
    console.log('sending SMS to ' + filterredPhoneNumbers)
    const {result} = await SMS.sendSMSAsync(filterredPhoneNumbers, `
      ${message || DEFAULT_MESSAGE}
      שם: ${name}
      מיקום נוכחי: ${location}
      ${address ? `כתובת מגורים: ${address}` : ''}
    `.trim())
    return result != 'cancelled'
  } catch (error) {
    console.error(`Error sending sms to '${filterredPhoneNumbers}' ` + error)
    throw error
  }
}
