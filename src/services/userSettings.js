import { AsyncStorage } from 'react-native';

const STORAGE_KEY = 'userSettings'

const settings = null
export async function getUserSettings() {
  try {
    if (!settings) {
      const settingsString = await AsyncStorage.getItem(STORAGE_KEY)
      settings = settingsString && JSON.parse(settingsString)
    }
  } catch (error) {
    console.error("Error loading user settings. " + error)
  }

  return settings || {}
}

export async function setUserSettings(newSettings) {
  settings = newSettings
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Error saving user settings. " + error);
    throw error
  }
}
