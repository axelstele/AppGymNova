// @ vendor
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Input, Button, CheckBox, withTheme } from "react-native-elements";
import Toast from "react-native-root-toast";
import * as SecureStore from "expo-secure-store";
// @ apis
import client from "../api";
// @ utils
import registerUsersAppToken from "../utils/registerUsersAppToken";
// @ assets
import logo from "../assets/images/logo_SC_oscuro.png";

const window = Dimensions.get("window");
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width / 4;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoading: false,
      checked: false,
    };
    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleCheckChange = () => {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  };

  iniciarSesion = () => {
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
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: IMAGE_HEIGHT,
      }),
    ]).start();
  };

  keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: IMAGE_HEIGHT_SMALL,
      }),
    ]).start();
  };

  render() {
    const { theme } = this.props;
    const { email, password, isLoading, checked } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View
          style={[styles.container, { paddingBottom: this.keyboardHeight }]}
        >
          <Animated.Image
            source={logo}
            style={[styles.logo, { height: this.imageHeight }]}
          />
          <Input
            autoCapitalize="none"
            containerStyle={{ marginBottom: 20 }}
            disabled={isLoading}
            inputStyle={styles.input}
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            name="email"
            onChangeText={(text) => this.handleChange("email", text)}
            placeholder="E-mail"
            value={email}
          />
          <Input
            containerStyle={{ marginBottom: 20, width: "100%" }}
            disabled={isLoading}
            inputStyle={styles.input}
            leftIcon={{ type: "font-awesome", name: "key" }}
            name="password"
            onChangeText={(text) => this.handleChange("password", text)}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={password}
          />
          <Button
            buttonStyle={{
              width: "100%",
              marginTop: 40,
            }}
            icon={{
              type: "font-awesome",
              name: "sign-in",
            }}
            loading={isLoading}
            onPress={this.iniciarSesion}
            title="Iniciar sesión"
            titleStyle={{ fontWeight: "bold" }}
          />
          <CheckBox
            title="Recordarme"
            checked={checked}
            onPress={this.handleCheckChange}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
            checkedColor="#18bc9c"
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "space-around",
    padding: 20,
  },
  input: {
    height: 40,
    marginLeft: 10,
  },
  logo: {
    alignSelf: "center",
    height: 200,
    margin: 20,
    marginBottom: 50,
    resizeMode: "contain",
    width: 200,
  },
});

export default withTheme(LoginScreen);
