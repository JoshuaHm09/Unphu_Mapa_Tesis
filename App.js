import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar, View, Modal, Text, TextInput, Pressable, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import MapScreen from "./src/MapScreen";
import IntroScreen from "./src/components/IntroScreen";
import DirectoryScreen from "./src/DirectoryScreen/DirectoryScreen";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("map");
  const [role, setRole] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    const user = username.trim().toLowerCase();
    if (user === ADMIN_USER && password === ADMIN_PASS) {
      setRole("admin");
      setUsername("");
      setPassword("");
      return;
    }

    Alert.alert("Credenciales inválidas", "Usa usuario y contraseña de administrador válidos.");
  };

  const handleGuestLogin = () => {
    setRole("guest");
    setUsername("");
    setPassword("");
  };

  const isAdmin = role === "admin";

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" />
        <View style={{ flex: 1 }}>
          {currentScreen === "map" ? (
            <MapScreen
              hideBottomMenu={showIntro}
              goToDirectory={() => setCurrentScreen("directory")}
              canAccessAdmin={isAdmin}
            />
          ) : (
            <DirectoryScreen goBackToMap={() => setCurrentScreen("map")} />
          )}

          {showIntro && role && <IntroScreen onFinish={() => setShowIntro(false)} />}

          <Modal transparent visible={!role} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.title}>Iniciar sesión</Text>

                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Usuario"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Contraseña"
                  secureTextEntry
                  style={styles.input}
                />

                <Pressable style={styles.primaryButton} onPress={handleAdminLogin}>
                  <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={handleGuestLogin}>
                  <Text style={styles.secondaryButtonText}>Continuar como invitado</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
};
