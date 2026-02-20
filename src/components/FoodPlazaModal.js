import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { styles } from "../mapStyles";

const FOOD_ORANGE = "#FFA500";

export default function FoodPlazaModal({ plaza, onClose, ImageCarousel }) {

  const visible = !!plaza;


  const vendorKeys = useMemo(() => Object.keys(plaza?.vendors || {}), [plaza]);
  const firstVendor = vendorKeys.length > 0 ? vendorKeys[0] : null;

  const [activeVendor, setActiveVendor] = useState(firstVendor);


  useEffect(() => {
    setActiveVendor(firstVendor);
  }, [firstVendor]);

  const vendorDetails =
    (activeVendor && plaza?.vendors?.[activeVendor]) || {
      schedule: "No disponible",
      images: [],
      menu: [],
    };

  const menuScrollViewRef = useRef(null);

  useEffect(() => {

    if (!visible) return;
    menuScrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeVendor, visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalContainer}>
        {/* CLOSE */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeButtonText, { color: FOOD_ORANGE }]}>
            X
          </Text>
        </Pressable>

        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: FOOD_ORANGE }]}>
            {plaza?.name || ""}
          </Text>

          // Carrusel
          {ImageCarousel ? (
            <ImageCarousel images={vendorDetails.images || []} />
          ) : null}

          <View style={styles.tabScrollViewContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabContainer}
            >
              {vendorKeys.map((vendorName) => (
                <Pressable
                  key={vendorName}
                  onPress={() => setActiveVendor(vendorName)}
                  style={[
                    styles.tab,
                    activeVendor === vendorName && {
                      backgroundColor: FOOD_ORANGE,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeVendor === vendorName && styles.activeTabText,
                    ]}
                  >
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
            {!(vendorDetails.menu || []).length ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#6B7280",
                }}
              >
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
                  <Text style={{ fontSize: 16, color: "#374151" }}>
                    {menuItem.item}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: FOOD_ORANGE,
                    }}
                  >
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
