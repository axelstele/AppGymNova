import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Header, Card, Input, Button } from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import moment from "moment";
import Toast from 'react-native-root-toast';
import axios from 'axios';

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:8000`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});

export default class MisDatosScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      nombre: '',
      apellido: '',
      sexo: '',
      telefono: '',
      fechaNac: '',
      fechaIngreso: '',
      email: '',
      id_usuario: -1
    }
  }

  render() {
    const { isLoading, nombre, apellido, sexo, telefono, fechaNac, fechaIngreso, email } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{ text: 'Mis datos', style: { color: '#fff' } }}
          backgroundColor="#212529"
        />
        <Input
          inputStyle={styles.input}
          id='nombre'
          name='nombre'
          value={nombre}
          onChangeText={(text) => this.handleChange('nombre', text)}
          placeholder='Nombre'
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id='apellido'
          name='apellido'
          value={apellido}
          onChangeText={(text) => this.handleChange('apellido', text)}
          placeholder='Apellido'
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id='apellido'
          name='apellido'
          value={apellido}
          onChangeText={(text) => this.handleChange('apellido', text)}
          placeholder='Apellido'
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        { isLoading &&
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'rgba(52, 52, 52, 0.7)'
            }}>
              <ActivityIndicator color='#000' />
            </View>
        }
      </View>
    )
  }
}
