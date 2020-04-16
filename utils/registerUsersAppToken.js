// @ vendor
import { Platform } from "react-native";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
// @ apis
import client from "../api";
// @ constants
import { ID_EMPRESA } from "react-native-dotenv";

const registerUsersAppToken = async (id_usuario) => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    await client.post("/api/guardar_token", {
      empresa: ID_EMPRESA,
      id_usuario: id_usuario,
      token: token,
    });
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default registerUsersAppToken;
