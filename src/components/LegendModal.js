import React from "react";
import { View, Modal, Pressable, Text } from "react-native";

const LegendModal = ({ visible, onClose, bottomInset = 0 }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* FONDO OSCURO – TAP FUERA */}
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: -15.9 + bottomInset,
            backgroundColor: "#00000070",
          }}
          onPress={onClose}
        />

        {/* CONTENIDO */}
        <View
          style={{
            width: "80%",
            padding: 20,
            borderRadius: 18,
            backgroundColor: "white",
            elevation: 12,
            zIndex: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Leyenda
          </Text>
          <Text style={{ opacity: 0.7 }}>Aquí va la explicación…</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LegendModal;
