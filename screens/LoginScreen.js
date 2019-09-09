import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoading: false
    };
  }

  handleChange(name, value) { this.setState({ [name]: value }) }

  iniciarSesion() {
    const { email, password } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        let response = await axios.post('https://sportcenterbahia.herokuapp.com/api/login', {
          email: email,
          password: password
        });
        this.setState({ isLoading: false }, async () => {
          if (response.data) {
            try {
              await AsyncStorage.setItem('isLogged', '1');
              this.props.navigation.navigate('App');
            }
            catch (e) {
              console.log(e);
            }
          }
        });
      }
      catch (e) {
        console.log(e.response) // undefined
        this.setState({ isLoading: false });
      }

    });
  }

  render() {
    const { email, password, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <Input
          style={styles.input}
          id='email'
          name='email'
          value={email}
          onChangeText={(text) => this.handleChange('email', text)}
          placeholder='E-mail'
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          autoCapitalize = 'none'
          disabled={isLoading}
        />
        <Input
          style={styles.input}
          id='password'
          name='password'
          value={password}
          onChangeText={(text) => this.handleChange('password', text)}
          placeholder='Contraseña'
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          secureTextEntry={true}
          disabled={isLoading}
        />
        <Button
          title="Iniciar sesión"
          icon={{
            type: 'font-awesome',
            name: "sign-in",
            size: 15,
            color: "white"
          }}
          loading={isLoading}
          onPress={() => this.iniciarSesion()}
        />
      </View>
    )
  }
}
