import {Permissions, Contacts} from 'expo'

export async function verifyContactsPermissions() {
  try {
    console.log('Checking contacts permissions...')
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    console.log(`Contacts permission status: ${status}`)
    return status === 'granted'
  } catch (error) {
    console.error('Error verifing contacts permissions ' + error)
  }
}

export async function getAllContacts() {
  try {
    console.log('Getting contacts...')
    const {data} = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name
      ]
    })

    return data
  } catch (error) {
    console.error('Error getting contacts. ' + error)
    throw error
  }
}

export async function getContactById(id) {
  try {
    console.log(`Getting contacts '${id}'...`)
    const contact = await Contacts.getContactByIdAsync(id, [
      Contacts.Fields.Name,
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Image
    ])
    return contact
  } catch (error) {
    console.error('Error getting contact. ' + error)
    throw error
  }
}

export async function getContactImage(id) {
  try {
    console.log(`Getting contact '${id}' image...`)
    const contact = await Contacts.getContactByIdAsync(id, [
      Contacts.Fields.Image
    ])
    return contact.image
  } catch (error) {
    console.error('Error getting contact image. ' + error)
    throw error
  }
}
