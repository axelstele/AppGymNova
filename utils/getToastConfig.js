// @ vendor
import Toast from "react-native-root-toast";

const toastConfig = (type) => ({
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  textColor: "black",
  backgroundColor: type === "success" ? "#4BB543" : "#FF9494",
});

export default toastConfig;
