import React from "react";
import { Pressable, StyleSheet, Image } from "react-native";

export default function RouteButton({ onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Image
        source={require("../../assets/origen.png")}
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 2,
    marginTop: 1,
 },

 icon: {
   width: 20,
   height: 20,
   resizeMode: "contain",
   marginLeft:-5
 },
});