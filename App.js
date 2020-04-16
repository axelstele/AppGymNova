// @ vendor
import React, { Component, Fragment } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { ThemeProvider } from "react-native-elements";
// @ apis
import client from "./api";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";
// @ components
import AppNavigator from "./navigation/AppNavigator";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      theme: {},
    };
  }

  fetchFonts = () => {
    return Font.loadAsync({
      "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
      "roboto-italic": require("./assets/fonts/Roboto-Italic.ttf"),
      "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    });
  };

  loadResourcesAsync = async () => {
    try {
      await this.fetchFonts();
      const res = await client.get(`/api/get_app_settings/${ID_EMPRESA}`);
      const primary = res.data[1].valor_string;
      const secondary = res.data[2].valor_string;
      const tertiary = res.data[0].valor_string;
      this.setState({
        theme: {
          colors: {
            primary: primary,
            secondary: secondary,
          },
          Button: {
            buttonStyle: {
              backgroundColor: primary,
            },
            icon: {
              color: tertiary,
            },
            titleStyle: {
              color: tertiary,
              fontFamily: "roboto-regular",
            },
          },
          Header: {
            backgroundColor: primary,
            centerComponent: {
              style: {
                color: tertiary,
              },
            },
            leftComponent: {
              color: secondary,
            },
          },
          Input: {
            inputStyle: {
              color: secondary,
            },
            leftIcon: {
              color: primary,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const { skipLoadingScreen } = this.props;
    const { isLoadingComplete, theme } = this.state;
    return (
      <Fragment>
        {!isLoadingComplete && !skipLoadingScreen ? (
          <AppLoading
            startAsync={this.loadResourcesAsync}
            onError={this.handleLoadingError}
            onFinish={this.handleFinishLoading}
          />
        ) : (
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <ThemeProvider theme={theme}>
              <AppNavigator />
            </ThemeProvider>
          </View>
        )}
      </Fragment>
    );
  }
}

export default App;
