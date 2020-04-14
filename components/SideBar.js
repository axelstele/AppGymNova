import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from "react-native";
import { Icon, Text, Button, Image } from "react-native-elements";

const styles = StyleSheet.create({
  sideMenuContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  sideMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider1: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    marginTop: 15,
  },
  divider2: {
    width: "100%",
    height: 1,
    backgroundColor: "#e2e2e2",
  },
});

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.items = [
      {
        navOptionThumb: "home",
        navOptionName: "Inicio",
        screenToNavigate: "Home",
        type: "font-awesome",
      },
      {
        navOptionThumb: "dollar",
        navOptionName: "Mis Pagos",
        screenToNavigate: "MisPagos",
        type: "font-awesome",
      },
      {
        navOptionThumb: "directions-run",
        navOptionName: "Mis Clases",
        screenToNavigate: "MisClases",
        type: "material",
      },
      {
        navOptionThumb: "user",
        navOptionName: "Mis datos",
        screenToNavigate: "MisDatos",
        type: "font-awesome",
      },
    ];
  }

  onPressCerrarSesion() {
    Alert.alert(
      "Confirmación",
      "¿Está seguro que desea cerrar sesión?",
      [
        { text: "Confirmar", onPress: () => this.cerrarSesion() },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  cerrarSesion() {
    this.setState({ isLoading: true }, async () => {
      await AsyncStorage.removeItem("isLogged");
      await AsyncStorage.removeItem("id_usuario");
      this.setState({ isLoading: false }, () => {
        this.props.navigation.navigate("Auth");
      });
    });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.sideMenuContainer}>
        <Image
          source={require("../assets/images/logo_SC_oscuro.png")}
          containerStyle={{ height: 150, width: 150 }}
        />
        <View style={styles.sideMenuHeader}>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Gimnasio Nova
          </Text>
        </View>
        <View style={styles.divider1} />
        <View style={{ width: "100%" }}>
          {this.items.map((item, key) => (
            <TouchableOpacity
              key={key}
              onPress={() => {
                global.currentScreenIndex = key;
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate(item.screenToNavigate);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor:
                    global.currentScreenIndex === key ? "#18bc9c" : "white",
                }}
              >
                <View style={{ marginRight: 10, marginLeft: 20, width: 30 }}>
                  <Icon
                    name={item.navOptionThumb}
                    size={25}
                    color="black"
                    type={item.type}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: 10,
                  }}
                >
                  {item.navOptionName}
                </Text>
              </View>
              <View style={styles.divider2} />
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            title="Cerrar sesión"
            icon={{
              type: "font-awesome",
              name: "sign-out",
              color: "black",
            }}
            buttonStyle={{ backgroundColor: "#18bc9c", width: "100%" }}
            containerStyle={{ margin: 10 }}
            titleStyle={{ color: "black", fontWeight: "bold" }}
            loading={isLoading}
            onPress={() => this.onPressCerrarSesion()}
          />
        </View>
      </View>
    );
  }
}
