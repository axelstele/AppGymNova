// @ vendor
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon, ListItem, withTheme } from "react-native-elements";
import CalendarStrip from "react-native-calendar-strip";
import Toast from "react-native-root-toast";
import moment from "moment";
import esLocale from "moment/locale/es";
moment.updateLocale("es", esLocale);
// @ apis
import client from "../api";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";
// @ utils
import getUser from "../utils/getAsyncStorage";
import toastConfig from "../utils/getToastConfig";
// @components
import CustomHeader from "../components/CustomHeader";

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

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingRefreshControl: false,
      selectedDate: moment(),
      clases: [],
      id_usuario: null,
      clasesMiembro: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const id_usuario = await getUser();
      this.setState({ id_usuario }, async () => {
        await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
        this.setState({ isLoading: false });
      });
    });
  }

  async refreshClases() {
    const { selectedDate } = this.state;
    try {
      const res = await client.post("/api/get_clases", {
        dia: selectedDate.format("YYYY-MM-DD"),
        empresa: ID_EMPRESA,
      });
      this.setState({ clases: res.data });
    } catch (error) {
      Toast.show("Ocurrió un error al obtener las clases, intente nuevamente", {
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

  async refreshClasesMiembro() {
    const { id_usuario } = this.state;
    try {
      const res = await client.post("/api/get_clases_miembro", {
        empresa: ID_EMPRESA,
        id_usuario: id_usuario,
      });

      this.setState({ clasesMiembro: res.data });
    } catch (error) {
      Toast.show(
        "Ocurrió un error al obtener las clases del usuario, intente nuevamente",
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          textColor: "black",
          backgroundColor: "#18bc9c",
        }
      );
    }
  }

  onChangeDate = (selectedDate) => {
    this.setState({ isLoading: true, selectedDate }, async () => {
      await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
      this.setState({ isLoading: false });
    });
  };

  onPressActividad(clase) {
    Alert.alert(
      "Confirmación",
      "¿Está seguro que desea adherirse a la clase de " +
        clase.clase_actividad +
        " en el horario de las " +
        clase.clase_hora_inicio +
        "?",
      [
        { text: "Confirmar", onPress: () => this.adherirClase(clase) },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  adherirClase(clase) {
    const { id_usuario } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        let res = await client.post("/api/adherir_clase", {
          empresa: ID_EMPRESA,
          id_clase: clase.id,
          id_usuario: id_usuario,
        });
        Toast.show(res.data.message, toastConfig("success"));
        await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
        this.setState({ isLoading: false });
      } catch (error) {
        this.setState({ isLoading: false }, () => {
          Toast.show(
            "Ocurrió un error, intente nuevamente",
            toastConfig("error")
          );
        });
      }
    });
  }

  onCancelarClase(clase) {
    Alert.alert(
      "Confirmación",
      "¿Está seguro que desea eliminarse de la clase de " +
        clase.clase_actividad +
        " en el horario de las " +
        clase.clase_hora_inicio +
        "?",
      [
        {
          text: "Confirmar",
          onPress: () => this.confirmarCancelarClase(clase),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  confirmarCancelarClase(clase) {
    const { id_usuario } = this.state;
    this.setState({ isLoading: true }, async () => {
      try {
        let res = await client.post("/api/cancelar_clase", {
          empresa: ID_EMPRESA,
          id_clase: clase.id,
          id_usuario: id_usuario,
        });
        Toast.show(res.data.message, toastConfig("success"));
        await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
        this.setState({ isLoading: false });
      } catch (error) {
        this.setState({ isLoading: false }, () => {
          Toast.show(
            "Ocurrió un error, intente nuevamente",
            toastConfig("error")
          );
        });
      }
    });
  }

  handleRefreshControl = () => {
    this.setState({ isLoadingRefreshControl: true }, async () => {
      await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
      this.setState({ isLoadingRefreshControl: false });
    });
  };

  render() {
    const { theme } = this.props;
    const { clases, clasesMiembro, isLoading, isLoadingRefreshControl, selectedDate  } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader
          onPress={() => this.props.navigation.openDrawer()}
          text="Clases"
        />
        <CalendarStrip
          selectedDate={selectedDate}
          calendarAnimation={{ type: "sequence", duration: 100 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 2,
            borderHighlightColor: theme.colors.primary,
          }}
          calendarHeaderStyle={{ color: theme.colors.secondary }}
          calendarColor="white"
          dateNumberStyle={{ color: theme.colors.secondary }}
          dateNameStyle={{ color: theme.colors.primary }}
          highlightDateNumberStyle={{ color: theme.colors.primary }}
          highlightDateNameStyle={{ color: theme.colors.primary }}
          disabledDateNameStyle={{ color: "#CCCCCC" }}
          disabledDateNumberStyle={{ color: "#CCCCCC" }}
          onDateSelected={this.onChangeDate}
          style={{
            height: 150,
            paddingBottom: 10,
            paddingTop: 10,
            width: "100%",
          }}
          refreshing={isLoading}
          locale={{
            name: "es",
            config: {
              months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
                "_"
              ),
              monthsShort: "ene._feb._mar_abr._may_jun_jul._ago_sep._oct._nov._dic.".split(
                "_"
              ),
              weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split(
                "_"
              ),
              weekdaysShort: "dom_lun_mar_mie_jue_vie_sab".split("_"),
              weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
            },
          }}
          markedDates={clasesMiembro.map((claseMiembro) => ({
            date: moment(claseMiembro.clase_fecha),
            dots: [
              {
                key: 1,
                color:
                  moment(claseMiembro.clase_fecha).format("YYYY-MM-DD") <
                  moment().format("YYYY-MM-DD")
                    ? "#f8cdc8"
                    : "#18bc9c",
              },
            ],
          }))}
        />
        {clases.length == 0 ? (
          <Text h3 style={{ textAlign: "center" }}>
            No se encontraron clases
          </Text>
        ) : (
          <FlatList
            data={clases}
            extraData={this.state}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={item.clase_actividad}
                containerStyle={{ backgroundColor: "white" }}
                subtitle={item.clase_hora_inicio + " hs."}
                bottomDivider
                onPress={() => this.onPressActividad(item)}
                titleStyle={{
                  flex: 1,
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
                disabled={
                  item.clase_cupos - item.clase_cupos_actual >=
                    item.clase_cupos ||
                  item.clase_cancelada ||
                  !item.clase_activo ||
                  moment(
                    item.clase_fecha + " " + item.clase_hora_inicio
                  ).format("YYYY-MM-DD HH:mm") <
                    moment().format("YYYY-MM-DD HH:mm") ||
                  clasesMiembro.some(
                    (claseMiembro) => claseMiembro.clase_id == item.id
                  )
                }
                disabledStyle={{
                  backgroundColor:
                    clasesMiembro.some(
                      (claseMiembro) => claseMiembro.clase_id == item.id
                    ) &&
                    moment(
                      item.clase_fecha + " " + item.clase_hora_inicio
                    ).format("YYYY-MM-DD HH:mm") >
                      moment().format("YYYY-MM-DD HH:mm")
                      ? "#18bc9c"
                      : "grey",
                }}
                badge={
                  moment(
                    item.clase_fecha + " " + item.clase_hora_inicio
                  ).format("YYYY-MM-DD HH:mm") >
                  moment().format("YYYY-MM-DD HH:mm")
                    ? {
                        value:
                          item.clase_cupos -
                          item.clase_cupos_actual +
                          "/" +
                          item.clase_cupos,
                        textStyle: { color: "black" },
                        badgeStyle: { backgroundColor: "white" },
                      }
                    : undefined
                }
                rightIcon={
                  clasesMiembro.some(
                    (claseMiembro) => claseMiembro.clase_id == item.id
                  ) &&
                  moment(
                    item.clase_fecha + " " + item.clase_hora_inicio
                  ).format("YYYY-MM-DD HH:mm") >
                    moment().format("YYYY-MM-DD HH:mm") && (
                    <Icon
                      size={32}
                      onPress={() => this.onCancelarClase(item)}
                      name="times-circle"
                      type="font-awesome"
                    />
                  )
                }
              />
            )}
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={isLoadingRefreshControl}
                onRefresh={this.handleRefreshControl}
              />
            }
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

export default withTheme(HomeScreen);
