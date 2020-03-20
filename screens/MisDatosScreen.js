import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Header, Card, Input, Button, CheckBox } from "react-native-elements";
import moment from "moment";
import Toast from "react-native-root-toast";
import axios from "axios";
import id_empresa from "../constants/Empresa";

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:8000`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36
  }
});

export default class MisDatosScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      nombre: "",
      apellido: "",
      sexo: "",
      telefono: "",
      fechaNac: "",
      fechaIngreso: "",
      email: "",
      id_usuario: -1
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      let id_usuario = await AsyncStorage.getItem("id_usuario");
      id_usuario = parseInt(id_usuario, 10);
      this.setState({ id_usuario }, async () => {
        await Promise.all([this.refreshDatos()]);
        this.setState({ isLoading: false });
      });
    });
  }

  async refreshDatos() {
    const { id_usuario } = this.state;

    try {
      const res = await axios.post(uri + "/api/get_datos", {
        empresa: id_empresa,
        id_usuario: id_usuario
      });

      this.setState({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        sexo: res.data.sexo,
        telefono: res.data.telefono,
        fechaNac: res.data.fecha_nac,
        fechaIngreso: res.data.fecha_ing,
        email: res.data.email
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      isLoading,
      nombre,
      apellido,
      sexo,
      telefono,
      fechaNac,
      fechaIngreso,
      email
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{
            icon: "menu",
            color: "#fff",
            onPress: () => this.props.navigation.openDrawer()
          }}
          centerComponent={{ text: "Mis datos", style: { color: "#fff" } }}
          backgroundColor="#212529"
        />
        <Input
          inputStyle={styles.input}
          id="nombre"
          name="nombre"
          value={nombre}
          onChangeText={text => this.handleChange("nombre", text)}
          placeholder="Nombre"
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id="apellido"
          name="apellido"
          value={apellido}
          onChangeText={text => this.handleChange("apellido", text)}
          placeholder="Apellido"
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <CheckBox center title="M" checked={sexo === "M"} />
          <CheckBox center title="F" checked={sexo === "F"} />
        </View>
        <Input
          inputStyle={styles.input}
          id="email"
          name="email"
          value={email}
          onChangeText={text => this.handleChange("email", text)}
          placeholder="E-mail"
          disabled={true}
          containerStyle={{ margin: 20 }}
        />
        <Input
          inputStyle={styles.input}
          id="telefono"
          name="telefono"
          value={telefono}
          onChangeText={text => this.handleChange("telefono", text)}
          placeholder="Teléfono"
          disabled={isLoading}
          containerStyle={{ margin: 20 }}
        />
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(52, 52, 52, 0.7)"
            }}
          >
            <ActivityIndicator color="#000" />
          </View>
        )}
      </View>
    );
  }
}
