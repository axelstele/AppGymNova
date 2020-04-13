// @ vendor
import { AsyncStorage } from "react-native";

const getUser = async () => {
  let id_usuario = await AsyncStorage.getItem("id_usuario");
  id_usuario = parseInt(id_usuario, 10);
  return id_usuario;
};

export default getUser;
