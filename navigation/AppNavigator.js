// @ vendor
import React, { Component } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
} from "react-navigation";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
// @ components
import HomeScreen from "../screens/HomeScreen";
import MisPagosScreen from "../screens/MisPagosScreen";
import MisClasesScreen from "../screens/MisClasesScreen";
import LoginScreen from "../screens/LoginScreen";
import MisDatosScreen from "../screens/MisDatosScreen";
import SideBar from "../components/SideBar";
// @ utils
import getUser from "../utils/getAsyncStorage";
import registerUsersAppToken from "../utils/registerUsersAppToken";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const isLogged = await SecureStore.getItemAsync("isLogged");

    if (isLogged) {
      const id_usuario = await getUser();
      await registerUsersAppToken(id_usuario);
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(isLogged ? "App" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AppStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    MisPagos: {
      screen: MisPagosScreen,
      navigationOptions: {
        header: null,
      },
    },
    MisClases: {
      screen: MisClasesScreen,
      navigationOptions: {
        header: null,
      },
    },
    MisDatos: {
      screen: MisDatosScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "Home",
  }
);

const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const MyDrawerNavigator = createDrawerNavigator(
  {
    Home: AppStack,
  },
  {
    contentComponent: (props) => <SideBar {...props} />,
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MyDrawerNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);
