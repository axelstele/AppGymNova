// @ vendor
import React from "react";
import { Header } from "react-native-elements";

const customHeader = ({ text, onPress }) => (
  <Header
    centerComponent={{
      text: text,
      style: { fontFamily: "roboto-bold", fontSize: 26, fontWeight: "bold" },
    }}
    containerStyle={{
      height: 70,
    }}
    leftComponent={{
      icon: "menu",
      onPress: onPress,
      style: { fontSize: 26 },
    }}
  />
);

export default customHeader;
