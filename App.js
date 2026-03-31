import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import MapScreen from "./src/MapScreen";
import IntroScreen from "./src/components/IntroScreen";
import DirectoryScreen from "./src/DirectoryScreen/DirectoryScreen";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("map");

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" />
        <View style={{ flex: 1 }}>
          {currentScreen === "map" ? (
            <MapScreen
              hideBottomMenu={showIntro}
              goToDirectory={() => setCurrentScreen("directory")}
            />
          ) : (
            <DirectoryScreen
              goBackToMap={() => setCurrentScreen("map")}
            />
          )}

          {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}