import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapScreen from "./src/MapScreen";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <MapScreen />
    </GestureHandlerRootView>
  );
}
