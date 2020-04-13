// @ vendor
import React, { Component, Fragment } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Card, Header, Input } from "react-native-elements";
import moment from "moment";
import StarRating from "react-native-star-rating";
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

export default class MisClasesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      clasesMiembro: [],
      id_usuario: -1,
      selectedRating: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const id_usuario = await getUser();
      this.setState({ id_usuario }, async () => {
        await this.refreshClasesMiembro();
        this.setState({ isLoading: false });
      });
    });
  }

  async refreshClasesMiembro() {
    const { id_usuario } = this.state;
    try {
      const res = await client.post("/api/get_clases_miembro", {
        empresa: ID_EMPRESA,
        id_usuario: id_usuario,
      });

      this.setState({ clasesMiembro: res.data });
    } catch (error) {
      Toast.show("Error de servidor, intente nuevamente", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        textColor: "black",
        backgroundColor: "#18bc9c",
      });
    }
  }

  handleChange = (item, text) => {
    const { clasesMiembro } = this.state;
    let index = clasesMiembro.findIndex((clase) => clase.id === item.id);
    clasesMiembro[index].cal_comentario = text;
    this.setState({ clasesMiembro });
  };

  handleRatingClick = (rate, item) => {
    const { clasesMiembro } = this.state;
    let index = clasesMiembro.findIndex((clase) => clase.id === item.id);
    clasesMiembro[index].cal_valor = rate;
    this.setState({ clasesMiembro });
  };

  handleCalificarClick = (clase) => {
    const { id_usuario } = this.state;
    this.setState({ isLoading: true }, async () => {
      try {
        const res = await client.post("/api/calificar_clase", {
          empresa: ID_EMPRESA,
          id_usuario: id_usuario,
          id_clase: clase.id,
          puntaje: clase.cal_valor,
          comentario: clase.cal_comentario,
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
        await this.refreshClasesMiembro();
        this.setState({ isLoading: false });
      } catch (error) {
        Toast.show("Error de servidor, intente nuevamente", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          textColor: "black",
          backgroundColor: "#18bc9c",
        });
        this.setState({ isLoading: false });
      }
    });
  };

  render() {
    const { isLoading, clasesMiembro } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{
            icon: "menu",
            color: "#fff",
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{ text: "Mis clases", style: { color: "#fff" } }}
          backgroundColor="#212529"
        />
        {clasesMiembro.length == 0 ? (
          <Text h3 style={{ textAlign: "center" }}>
            No se encontraron clases
          </Text>
        ) : (
          <FlatList
            data={clasesMiembro}
            extraData={this.state}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.clase_actividad}
                containerStyle={{
                  backgroundColor:
                    moment(
                      item.clase_fecha + " " + item.clase_hora_inicio
                    ).format("YYYY-MM-DD HH:mm") >
                    moment().format("YYYY-MM-DD HH:mm")
                      ? "#edf0f3"
                      : "white",
                  borderWidth:
                    moment(
                      item.clase_fecha + " " + item.clase_hora_inicio
                    ).format("YYYY-MM-DD HH:mm") >
                    moment().format("YYYY-MM-DD HH:mm")
                      ? 2
                      : 0,
                  borderColor: "black",
                }}
                titleStyle={{
                  backgroundColor:
                    moment(
                      item.clase_fecha + " " + item.clase_hora_inicio
                    ).format("YYYY-MM-DD HH:mm") >
                    moment().format("YYYY-MM-DD HH:mm")
                      ? "#18bc9c"
                      : "#f8cdc8",
                  color: "black",
                }}
              >
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Fecha:</Text>
                  <Text>
                    {" " + moment(item.clase_fecha).format("DD/MM/YYYY")}
                  </Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Hora inicio:</Text>
                  <Text>{" " + item.clase_hora_inicio}</Text>
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {moment(item.clase_fecha).format("YYYY-MM-DD") <
                    moment().subtract(7, "days").format("YYYY-MM-DD")
                      ? "Mi calificación: "
                      : "Calificar: "}
                  </Text>
                  <StarRating
                    activeOpacity={1}
                    disabled={
                      moment(item.clase_fecha).format("YYYY-MM-DD") <
                      moment().subtract(7, "days").format("YYYY-MM-DD")
                    }
                    emptyStarColor={
                      moment(item.clase_fecha).format("YYYY-MM-DD") <
                      moment().subtract(7, "days").format("YYYY-MM-DD")
                        ? "grey"
                        : "black"
                    }
                    fullStarColor={
                      moment(item.clase_fecha).format("YYYY-MM-DD") <
                      moment().subtract(7, "days").format("YYYY-MM-DD")
                        ? "grey"
                        : "black"
                    }
                    rating={item.cal_valor}
                    selectedStar={(rating) =>
                      this.handleRatingClick(rating, item)
                    }
                    starSize={24}
                  />
                </View>
                {moment(item.clase_fecha).format("YYYY-MM-DD") >=
                  moment().subtract(7, "days").format("YYYY-MM-DD") && (
                  <Fragment>
                    <Input
                      onChangeText={(text) => this.handleChange(item, text)}
                      placeholder="Comentario"
                      value={item.cal_comentario}
                    />
                    <Button
                      loading={isLoading}
                      onPress={() => this.handleCalificarClick(item)}
                      title="Calificar"
                    />
                  </Fragment>
                )}
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
