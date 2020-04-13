// @ vendor
import axios from 'axios';
// @ constants
import Constants from "expo-constants";
import { API_URL } from "react-native-dotenv";

const { manifest } = Constants;
const client = axios.create({
  baseURL: __DEV__
    ? `http://${manifest.debuggerHost.split(":").shift()}:8000`
    : API_URL,
});

export default client;
