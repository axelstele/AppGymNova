// @ vendor
import { AppLoading } from "expo";
import React, { useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { ThemeProvider } from "react-native-elements";
// @ apis
import client from "./api";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";
// @ components
import AppNavigator from "./navigation/AppNavigator";

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [theme, setTheme] = useState({});

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={() => loadResourcesAsync(setTheme)}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <ThemeProvider theme={theme}>
          <AppNavigator />
        </ThemeProvider>
      </View>
    );
  }
}

async function loadResourcesAsync(setTheme) {
  const res = await client.get(`/api/get_app_settings/${ID_EMPRESA}`);
  const primary = res.data[1].valor_string;
  const secondary = res.data[2].valor_string;
  const tertiary = res.data[0].valor_string;
  setTheme({
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
  });
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
