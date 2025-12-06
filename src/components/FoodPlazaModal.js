// ==============================
// File: src/components/FoodPlazaModal.js
// ==============================
import React, { useState, useRef, useEffect } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { styles } from "../mapStyles";
import { Image } from "expo-image";

const FOOD_ORANGE = "#FFA500";

export default function FoodPlazaModal({ plaza, onClose, ImageCarousel }) {
  if (!plaza) return null;

  const vendorKeys = Object.keys(plaza.vendors || {});
  const firstVendor = vendorKeys.length > 0 ? vendorKeys[0] : null;

  const [activeVendor, setActiveVendor] = useState(firstVendor);

  const vendorDetails =
    (activeVendor && plaza.vendors?.[activeVendor]) || {
      schedule: "No disponible",
      images: [],
      menu: [],
    };

  const menuScrollViewRef = useRef(null);

  useEffect(() => {
    menuScrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeVendor]);

  return (
    <Modal animationType="slide" transparent visible={!!plaza} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalContainer}>
        {/* CLOSE */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeButtonText, { color: FOOD_ORANGE }]}>X</Text>
        </Pressable>

        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: FOOD_ORANGE }]}>{plaza.name}</Text>

          {/* CARRUSEL */}
          {ImageCarousel ? <ImageCarousel images={vendorDetails.images || []} /> : null}

          <View style={styles.tabScrollViewContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
              {vendorKeys.map((vendorName) => (
                <Pressable
                  key={vendorName}
                  onPress={() => setActiveVendor(vendorName)}
                  style={[styles.tab, activeVendor === vendorName && { backgroundColor: FOOD_ORANGE }]}
                >
                  <Text style={[styles.tabText, activeVendor === vendorName && styles.activeTabText]}>
                    {vendorName}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <Text
            style={{
              textAlign: "center",
              marginTop: 4,
              marginBottom: 8,
              color: "#6B7280",
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            Horario: {vendorDetails.schedule}
          </Text>

          <ScrollView
            ref={menuScrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {(vendorDetails.menu || []).length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "#6B7280" }}>
                No hay menú disponible.
              </Text>
            ) : (
              vendorDetails.menu.map((menuItem, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#374151" }}>{menuItem.item}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: FOOD_ORANGE }}>
                    {menuItem.price}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
