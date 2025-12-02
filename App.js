import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapScreen from "./src/MapScreen";
import IntroScreen from "./src/components/IntroScreen";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <SafeAreaProvider>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/* MAPA */}
        <MapScreen />

        {/* INTRO ANIMADA SOBRE TODO */}
        {showIntro && (
          <IntroScreen onFinish={() => setShowIntro(false)} />
        )}
      </GestureHandlerRootView>

    </SafeAreaProvider>
  );
}
