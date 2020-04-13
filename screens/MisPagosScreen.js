// @ vendor
import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Header, Card } from "react-native-elements";
import moment from "moment";
import Toast from "react-native-root-toast";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";
// @ apis
import client from "../api";
// @ utils
import getUser from "../utils/getAsyncStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default class MisPagosScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      pagos: [],
      id_usuario: -1,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const id_usuario = await getUser();
      this.setState({ id_usuario }, async () => {
        await this.refreshPagos();
        this.setState({ isLoading: false });
      });
    });
  }

  async refreshPagos() {
    const { id_usuario } = this.state;
    try {
      const res = await client.post("/api/get_pagos", {
        empresa: ID_EMPRESA,
        id_usuario: id_usuario,
      });
      this.setState({ pagos: res.data });
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

  render() {
    const { isLoading, pagos } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{
            icon: "menu",
            color: "#fff",
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{ text: "Mis pagos", style: { color: "#fff" } }}
          backgroundColor="#212529"
        />
        {pagos.length == 0 ? (
          <Text h3 style={{ textAlign: "center" }}>
            No se encontraron pagos
          </Text>
        ) : (
          <FlatList
            data={pagos}
            extraData={this.state}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Card
                title={
                  moment(item.fecha_hasta).format("YYYY-MM-DD") >
                  moment().format("YYYY-MM-DD")
                    ? "Vigente"
                    : "Vencido"
                }
                containerStyle={{
                  backgroundColor: index == 0 ? "#edf0f3" : "white",
                  borderWidth: index == 0 ? 2 : 0,
                  borderColor: "black",
                }}
                titleStyle={{
                  backgroundColor:
                    moment(item.fecha_hasta).format("YYYY-MM-DD") >
                    moment().format("YYYY-MM-DD")
                      ? "#18bc9c"
                      : "#f8cdc8",
                  color: "black",
                }}
              >
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Clases:</Text>
                  <Text>{" " + item.cupos_cantidad + " / "}</Text>
                  <Text style={{ fontWeight: "bold" }}>Disponibles:</Text>
                  <Text>{" " + item.cupos_disponibles}</Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Desde:</Text>
                  <Text>
                    {" " + moment(item.fecha_desde).format("DD/MM/YYYY")}
                  </Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Hasta:</Text>
                  <Text>
                    {" " + moment(item.fecha_hasta).format("DD/MM/YYYY")}
                  </Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Pago realizado:</Text>
                  <Text>{" " + item.pago_realizado ? " Sí" : " No"}</Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Fecha pago:</Text>
                  <Text>
                    {" " + moment(item.fecha_pago).format("DD/MM/YYYY")}
                  </Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Monto:</Text>
                  <Text>{" $" + item.monto}</Text>
                </Text>
              </Card>
            )}
          />
        )}
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
    );
  }
}
