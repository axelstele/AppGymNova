import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Alert, AsyncStorage, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Input, Button, Image, Card, CheckBox } from 'react-native-elements';
import axios from 'axios';
import Toast from 'react-native-root-toast';

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:8000`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
  },
  image: {
    marginTop: 50,
    width: 200,
    height: 200,
    marginBottom: 50
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoading: false,
      checked: false
    };
  }

  handleChange(name, value) { this.setState({ [name]: value }) }

  iniciarSesion() {
    const { email, password, checked } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        let res = await axios.post(uri + '/api/login', {
          email: email,
          password: password
        });

        if (res.data.logged) {
          if (checked) {
            await AsyncStorage.setItem('isLogged', '1');
          }
          await AsyncStorage.setItem('id_usuario', res.data.id_usuario.toString());
          this.setState({ isLoading: false }, () => {
            this.props.navigation.navigate('App')
          });
        }
        else {
          this.setState({ isLoading: false }, () => {
            Toast.show('Verifique los datos ingresados', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              textColor: 'black',
              backgroundColor: '#18bc9c'
            });
          })
        }
      }
      catch (error) {
        this.setState({ isLoading: false }, () => {
          Toast.show('Ocurrió un error, intente nuevamente', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            textColor: 'black',
            backgroundColor: '#18bc9c'
          });
        });
      }

    });
  }

  handleCheckChange() {
    const { checked } = this.state;

    this.setState({ checked: !checked })
  }

  render() {
    const { email, password, isLoading, checked } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo_SC_oscuro.png') }
          containerStyle={styles.image}
        />
        <Input
          inputStyle={styles.input}
          id='email'
          name='email'
          value={email}
          onChangeText={(text) => this.handleChange('email', text)}
          placeholder='E-mail'
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          autoCapitalize = 'none'
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id='password'
          name='password'
          value={password}
          onChangeText={(text) => this.handleChange('password', text)}
          placeholder='Contraseña'
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          secureTextEntry={true}
          disabled={isLoading}
        />
        <View style={styles.bottom}>
          <Button
            title="Iniciar sesión"
            icon={{
              type: 'font-awesome',
              name: "sign-in",
              color: "black"
            }}
            buttonStyle={{ backgroundColor: '#18bc9c', width: '100%' }}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            loading={isLoading}
            onPress={() => this.iniciarSesion()}
          />
          <CheckBox
            title='Recordarme'
            checked={checked}
            onPress={() => this.handleCheckChange()}
            containerStyle={{ backgroundColor: 'transparent' }}
            checkedColor="#18bc9c"
          />
        </View>
      </View>
    )
  }
}
