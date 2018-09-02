import {Permissions, Location} from 'expo'

export async function verifyLocationPermissions() {
  try {
      console.log('Checking location permissions...')
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      console.log(`Location permission status: ${status}`)
      return status === 'granted'
  } catch (error) {
      console.error('Error verifing location permissions ' + error)
  }
}

export async function getCurrentLocation() {
  console.log('Getting current location...')
  try {
    const position = await Location.getCurrentPositionAsync({})
    console.log('Position: ' + JSON.stringify(position))
    const [location] = await Location.reverseGeocodeAsync(position.coords)
    console.log('Location: ' + JSON.stringify(location))
    const address = createAddressString(location)
    return address || createCoordsString(position.coords)
  } catch (error) {
    console.error(`Error getting current location ` + error)
    throw error
  }
}

function createCoordsString(coords) {
  return `Lat: ${coords.latitude}, Lng: ${coords.longitude}`
}

function createAddressString(location) {
  const parts = [
    `${location.street} ${location.name}`,
    location.city,
    location.postalCode,
    location.region,
    location.country
  ]
  return parts.reduce((str, part) => {
    if (!str) {
      return part || ''
    }
    return part ? `${str}, ${part}` : str
  })
}
