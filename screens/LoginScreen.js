// @ vendor
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import {
  Input,
  Button,
  Image,
  CheckBox,
  withTheme,
} from "react-native-elements";
import Toast from "react-native-root-toast";
import * as SecureStore from "expo-secure-store";
// @ apis
import client from "../api";
// @ utils
import registerUsersAppToken from "../utils/registerUsersAppToken";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  image: {
    marginTop: 50,
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoading: false,
      checked: false,
    };
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  iniciarSesion() {
    const { email, password, checked } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        let res = await client.post("/api/login", {
          email: email,
          password: password,
        });

        if (res.data.logged) {
          if (checked) {
            await SecureStore.setItemAsync("isLogged", "1");
          }
          const id_usuario = res.data.id_usuario.toString();
          await SecureStore.setItemAsync("id_usuario", id_usuario);
          await registerUsersAppToken(id_usuario);
          this.setState({ isLoading: false }, () => {
            this.props.navigation.navigate("App");
          });
        } else {
          this.setState({ isLoading: false }, () => {
            Toast.show("Verifique los datos ingresados", {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              textColor: "black",
              backgroundColor: "#18bc9c",
            });
          });
        }
      } catch (error) {
        this.setState({ isLoading: false }, () => {
          Toast.show("Ocurrió un error, intente nuevamente", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            textColor: "black",
            backgroundColor: "#18bc9c",
          });
        });
      }
    });
  }

  handleCheckChange() {
    const { checked } = this.state;

    this.setState({ checked: !checked });
  }

  render() {
    const { theme } = this.props;
    const { email, password, isLoading, checked } = this.state;
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo_SC_oscuro.png")}
          containerStyle={styles.image}
        />
        <Input
          inputStyle={styles.input}
          id="email"
          name="email"
          value={email}
          onChangeText={(text) => this.handleChange("email", text)}
          placeholder="E-mail"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          autoCapitalize="none"
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id="password"
          name="password"
          value={password}
          onChangeText={(text) => this.handleChange("password", text)}
          placeholder="Contraseña"
          leftIcon={{ type: "font-awesome", name: "key" }}
          secureTextEntry={true}
          disabled={isLoading}
        />
        <View style={styles.bottom}>
          <Button
            title="Iniciar sesión"
            icon={{
              type: "font-awesome",
              name: "sign-in",
            }}
            buttonStyle={{
              width: "100%",
            }}
            titleStyle={{ fontWeight: "bold" }}
            loading={isLoading}
            onPress={() => this.iniciarSesion()}
          />
          <CheckBox
            title="Recordarme"
            checked={checked}
            onPress={() => this.handleCheckChange()}
            containerStyle={{ backgroundColor: "transparent" }}
            checkedColor="#18bc9c"
          />
        </View>
      </View>
    );
  }
}

export default withTheme(LoginScreen);
