# Accessibility Helper App

An accessibility helper app built with React-Native and Expo.

## Local Setup
1. [nodejs](https://nodejs.org/) and [yarn](https://yarnpkg.com/) (for local development)
2. [Expo](https://expo.io/) client (for publishing and building apk in the cloud)
`npm install -g expo-cli`

## Local Development
1.
2. Start the android emulator (from android studio) or download and install the expo app on your phone.
3. Start the development server with one of this commands:
```sh
yarn start   # for developing using your phone
yarn android # for developing using the android emulator
```

## Building a new apk
1. Create an [Expo](https://expo.io) account
2. Run `expo publish` and make sure it publishes to your account
3. Make sure to use the original keystore!
2. Update `versionCode` in `app.json` (or Play store will reject it)
2. Run the following commands
```sh
expo publish # publishes a new version to the expo
expo build:android # builds a new android apk in the cloud
```
