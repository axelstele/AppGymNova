// @ vendor
import * as SecureStore from "expo-secure-store";

const getUser = async () => {
  let id_usuario = await SecureStore.getItemAsync("id_usuario");
  id_usuario = parseInt(id_usuario, 10);
  return id_usuario;
};

export default getUser;
