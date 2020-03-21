import React, { Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Header, Input, Button, CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
      apellido: "",
      email: "",
      fechaIngreso: "",
      fechaNac: null,
      id_usuario: -1,
      isLoading: false,
      nombre: "",
      sexo: null,
      showModalFechaNac: false,
      telefono: ""
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
        fechaNac: moment(res.data.fecha_nac, "YYYY-MM-DD").toDate(),
        fechaIngreso: res.data.fecha_ing,
        email: res.data.email
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleConfirm = date => {
    console.warn("A date has been picked: ", date);
    this.handleHideModalFechaNac();
  };

  handleShowModalFechaNac = () => {
    this.setState({ showModalFechaNac: true });
  };

  handleHideModalFechaNac = () => {
    this.setState({ showModalFechaNac: false });
  };

  handleSexoChange = sexo => {
    this.setState({ sexo });
  };

  render() {
    const {
      apellido,
      email,
      fechaIngreso,
      fechaNac,
      isLoading,
      nombre,
      sexo,
      showModalFechaNac,
      telefono
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
          containerStyle={{ marginTop: 20 }}
          disabled={isLoading}
          id="nombre"
          inputStyle={styles.input}
          label="Nombre"
          name="nombre"
          onChangeText={text => this.handleChange("nombre", text)}
          value={nombre}
        />
        <Input
          containerStyle={{ marginTop: 20 }}
          disabled={isLoading}
          id="apellido"
          inputStyle={styles.input}
          label="Apellido"
          name="apellido"
          onChangeText={text => this.handleChange("apellido", text)}
          value={apellido}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          <CheckBox
            title="M"
            checked={sexo === "M"}
            onPress={() => this.handleSexoChange("M")}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
            checkedColor="#18bc9c"
          />
          <CheckBox
            title="F"
            checked={sexo === "F"}
            onPress={() => this.handleSexoChange("F")}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
            checkedColor="#18bc9c"
          />
        </View>
        <Input
          containerStyle={{ marginTop: 20 }}
          disabled={true}
          id="email"
          inputStyle={styles.input}
          label="E-mail"
          name="email"
          onChangeText={text => this.handleChange("email", text)}
          value={email}
        />
        <Input
          containerStyle={{ marginTop: 20 }}
          disabled={isLoading}
          id="telefono"
          inputStyle={styles.input}
          label="Teléfono"
          name="telefono"
          onChangeText={text => this.handleChange("telefono", text)}
          value={telefono}
        />
        <TouchableOpacity onPress={() => this.handleShowModalFechaNac()}>
          <Input
            containerStyle={{ marginTop: 20 }}
            disabled={isLoading}
            id="fechaNac"
            inputStyle={styles.input}
            label="Fecha de nacimiento"
            name="fechaNac"
            pointerEvents="none"
            value={moment(fechaNac).format("DD/MM/YYYY")}
          />
        </TouchableOpacity>
        {showModalFechaNac && (
          <DateTimePickerModal
            date={fechaNac}
            isVisible={true}
            mode="date"
            onConfirm={() => this.handleConfirm()}
            onCancel={() => this.handleHideModalFechaNac()}
          />
        )}
        <Input
          containerStyle={{ marginTop: 20 }}
          disabled={true}
          id="fechaIngreso"
          inputStyle={styles.input}
          label="Fecha de ingreso"
          name="fechaIngreso"
          value={moment(fechaIngreso).format("DD/MM/YYYY")}
        />
        <Button
          title="Guardar cambios"
          icon={{
            type: "font-awesome",
            name: "sign-in",
            color: "black"
          }}
          buttonStyle={{ backgroundColor: "#18bc9c", width: "100%" }}
          titleStyle={{ color: "black", fontWeight: "bold" }}
          loading={isLoading}
          onPress={() => this.iniciarSesion()}
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
