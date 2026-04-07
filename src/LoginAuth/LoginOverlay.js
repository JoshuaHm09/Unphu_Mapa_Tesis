import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginOverlay({
  visible = true,
  onLogin,
  onContinueGuest,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!visible) return null;

  const handleLoginPress = () => {
    if (onLogin) {
      onLogin({ email, password });
    }
  };

  return (
    <Pressable style={styles.overlay}>
      <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centerWrap}
      >
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Admin Log In</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para acceder al panel administrativo
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo</Text>

            <View style={styles.inputRow}>
              <MaterialIcons name="person-outline" size={24} color="#111827" />

              <TextInput
                style={styles.input}
                placeholder="Escribe tu correo"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputLine} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>

            <View style={styles.inputRow}>
              <MaterialIcons name="lock-outline" size={24} color="#111827" />

              <TextInput
                style={styles.input}
                placeholder="Escribe tu contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputLine} />
          </View>

          <Pressable style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </Pressable>

          <Pressable style={styles.guestButton} onPress={onContinueGuest}>
            <Text style={styles.guestButtonText}>Continuar como Invitado</Text>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  centerWrap: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 470,
    backgroundColor: "#F8F8F8",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 8,
  },
  inputLine: {
    height: 1.5,
    backgroundColor: "#4B5563",
    opacity: 0.55,
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: "#39B54A",
    borderRadius: 16,
    minHeight: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1f7a2f",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  guestButton: {
    backgroundColor: "#1E6DEB",
    borderRadius: 16,
    minHeight: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    shadowColor: "#164ea8",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  guestButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});