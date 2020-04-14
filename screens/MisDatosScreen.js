// @ vendor
import React, { Component, Fragment } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, CheckBox, Input, withTheme } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Toast from "react-native-root-toast";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";
// @ apis
import client from "../api";
// @ utils
import getUser from "../utils/getAsyncStorage";
// @ components
import CustomHeader from "../components/CustomHeader";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
});

class MisDatosScreen extends Component {
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
      telefono: "",
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const id_usuario = await getUser();
      this.setState({ id_usuario }, async () => {
        await this.refreshDatos();
        this.setState({ isLoading: false });
      });
    });
  }

  async refreshDatos() {
    const { id_usuario } = this.state;
    try {
      const res = await client.post("/api/get_datos", {
        empresa: ID_EMPRESA,
        id_usuario: id_usuario,
      });
      this.setState({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        sexo: res.data.sexo,
        telefono: res.data.telefono,
        fechaNac: moment(res.data.fecha_nac, "YYYY-MM-DD").toDate(),
        fechaIngreso: res.data.fecha_ing,
        email: res.data.email,
      });
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
  }

  handleConfirmFechaNac = (fechaNac) => {
    this.setState({ fechaNac }, () => this.handleModalFechaNacChange());
  };

  handleModalFechaNacChange = () => {
    const { showModalFechaNac } = this.state;
    this.setState({ showModalFechaNac: !showModalFechaNac });
  };

  handleSexoChange = (sexo) => {
    this.setState({ sexo });
  };

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  handleCambiarDatos = () => {
    const {
      apellido,
      fechaNac,
      id_usuario,
      nombre,
      sexo,
      telefono,
    } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        const res = await client.post("/api/modificar_datos", {
          empresa: ID_EMPRESA,
          id_usuario: id_usuario,
          apellido: apellido,
          nombre: nombre,
          fecha_nac: fechaNac,
          sexo: sexo,
          telefono: telefono,
        });
        Toast.show(res.data.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          textColor: "black",
          backgroundColor: "#18bc9c",
        });
        await this.refreshDatos();
        this.setState({ isLoading: false });
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
      telefono,
    } = this.state;

    return (
      <Fragment>
        <CustomHeader
          onPress={() => this.props.navigation.openDrawer()}
          text="Mis Datos"
        />
        <View style={{ padding: 20 }}>
          <Input
            containerStyle={{ marginTop: 20 }}
            disabled={isLoading}
            id="nombre"
            inputStyle={styles.input}
            label="Nombre"
            name="nombre"
            onChangeText={(text) => this.handleChange("nombre", text)}
            value={nombre}
          />
          <Input
            containerStyle={{ marginTop: 20 }}
            disabled={isLoading}
            id="apellido"
            inputStyle={styles.input}
            label="Apellido"
            name="apellido"
            onChangeText={(text) => this.handleChange("apellido", text)}
            value={apellido}
          />
          <Input
            containerStyle={{ marginTop: 20 }}
            disabled={true}
            id="email"
            inputStyle={styles.input}
            label="E-mail"
            name="email"
            onChangeText={(text) => this.handleChange("email", text)}
            value={email}
          />
          <Input
            containerStyle={{ marginTop: 20 }}
            disabled={isLoading}
            id="telefono"
            inputStyle={styles.input}
            label="Teléfono"
            name="telefono"
            onChangeText={(text) => this.handleChange("telefono", text)}
            value={telefono}
          />
          <TouchableOpacity onPress={() => this.handleModalFechaNacChange()}>
            <Input
              containerStyle={{ marginTop: 20, width: 180 }}
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
              onConfirm={(date) => this.handleConfirmFechaNac(date)}
              onCancel={() => this.handleModalFechaNacChange()}
            />
          )}
          <Input
            containerStyle={{ marginTop: 20, width: 180 }}
            disabled={true}
            id="fechaIngreso"
            inputStyle={styles.input}
            label="Fecha de ingreso"
            name="fechaIngreso"
            value={moment(fechaIngreso).format("DD/MM/YYYY")}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <CheckBox
              title="M"
              checked={sexo === "M"}
              onPress={() => this.handleSexoChange("M")}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
              checkedColor="#18bc9c"
            />
            <CheckBox
              title="F"
              checked={sexo === "F"}
              onPress={() => this.handleSexoChange("F")}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
              checkedColor="#18bc9c"
            />
          </View>
          <Button
            icon={{
              type: "font-awesome",
              name: "check",
              color: "black",
            }}
            buttonStyle={{
              alignSelf: "center",
              backgroundColor: "#18bc9c",
              marginTop: 20,
              width: 100,
            }}
            loading={isLoading}
            onPress={() => this.handleCambiarDatos()}
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
                backgroundColor: "rgba(52, 52, 52, 0.7)",
              }}
            >
              <ActivityIndicator color="#000" />
            </View>
          )}
        </View>
      </Fragment>
    );
  }
}

export default withTheme(MisDatosScreen);
