import React from 'react';
import PropTypes from 'prop-types'
import {Alert, TouchableHighlight, StyleSheet, Image, TextInput, View, Button, ActivityIndicator, Text, Modal, FlatList} from 'react-native';
import { getAllContacts, getContactById, verifyContactsPermissions } from './services/contacts';

export default class SelectContact extends React.Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    selectContact: PropTypes.func.isRequired
  }

  state = {
    loadingContacts: true,
    contacts: [],
    selectedContact: null
  }

  constructor(props) {
    super(props)
    this.init()
  }

  init = async () => {
    const hasPermissions = await verifyContactsPermissions()
    if (hasPermissions) {
      const contacts = await getAllContacts()
      this.setState({
        loadingContacts: false,
        contacts
      })
    } else {
      this.props.closeModal()
    }
  }

  onContactSelected = async (id) =>  {
    const contact = await getContactById(id)
    this.setState({selectedContact: contact})
  }

  onPhoneNumberSelected = (phoneNumberId, number, label) => {
    const {id, name} = this.state.selectedContact
    this.props.selectContact(id, name, phoneNumberId, number, label)
    this.props.closeModal()
  }

  render() {
    if (this.state.loadingContacts) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {
          this.state.selectedContact ? (
            <View>
              <Image source={this.state.selectedContact.image} style={{width: 40, height: 40}} />
              <Text>{this.state.selectedContact.name}</Text>
              {
                this.state.selectedContact.phoneNumbers && this.state.selectedContact.phoneNumbers
                  .map(({id, label, number}) =>
                    <TouchableHighlight key={id} onPress={() => this.onPhoneNumberSelected(id, number, label)}>
                      <Text>{label} - {number}</Text>
                    </TouchableHighlight>
                  )
              }
            </View>
          ) : (
            <FlatList
              data={this.state.contacts}
              keyExtractor={contact => contact.id}
              onPressItem={this.contactSelected}
              renderItem={({item: {id, name, image}}) => (
                <TouchableHighlight onPress={() => this.onContactSelected(id)} style={styles.listItem}>
                  <Text style={styles.contactName}>{name}</Text>
                </TouchableHighlight>
              )}
            />
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    height: 50
  },
  contactName: {
    textAlign: 'right'
  }
})
