import React from "react";
import { View, Modal, Pressable, Text, ScrollView } from "react-native";
import { Image } from "expo-image";

const FavoritesModal = ({
  visible,
  onClose,
  favoritesList,
  handleUndo,
  renderFavoriteItem,
  UNDO_ICON,
  CLOSE_ICON,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          backgroundColor: "#00000070",
        }}
        onPress={onClose}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "white",
            borderRadius: 25,
            paddingTop: 50,
            paddingBottom: 22,
            overflow: "hidden",
            // sombra
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 10,
          }}
        >
          {/* UNDO BUTTON */}
          <Pressable
            onPress={handleUndo}
            style={{ position: "absolute", top: 12, left: 12 }}
          >
            <Image source={UNDO_ICON} style={{ width: 26, height: 26 }} />
          </Pressable>

          {/* CLOSE BUTTON */}
          <Pressable
            onPress={onClose}
            style={{ position: "absolute", top: 12, right: 12 }}
          >
            <Image source={CLOSE_ICON} style={{ width: 26, height: 26 }} />
          </Pressable>

          {/* TITLE */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: "#34A853",
              marginBottom: 18,
            }}
          >
            Favoritos
          </Text>

          {/* FAVORITE ITEMS LIST */}
          <ScrollView style={{ maxHeight: 350 }}>
            {favoritesList.length === 0 ? (
              <Text style={{ textAlign: "center", opacity: 0.6 }}>
                No tienes favoritos.
              </Text>
            ) : (
              favoritesList.map(renderFavoriteItem)
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FavoritesModal;
