import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { styles } from "../mapStyles";

const FOOD_ORANGE = "#FFA500";

const getValidImageList = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((img) => {
      if (typeof img === "string") return img.trim();
      if (img && typeof img === "object") return (img.url || img.src || "").trim();
      return "";
    })
    .filter(Boolean);
};

const getFirstValidImage = (images) => {
  if (!Array.isArray(images)) return "";

  for (const img of images) {
    if (typeof img === "string" && img.trim()) return img.trim();

    if (img && typeof img === "object") {
      const url = (img.url || img.src || "").trim();
      if (url) return url;
    }
  }

  return "";
};

const normalizeMenuList = (menu) => {
  if (!menu) return [];

  if (Array.isArray(menu)) {
    return menu.map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          price: "",
        };
      }

      if (item && typeof item === "object") {
        return {
          name: item.name || item.item || item.title || "Sin nombre",
          price: item.price != null ? String(item.price) : "",
        };
      }

      return {
        name: "Sin nombre",
        price: "",
      };
    });
  }

  if (typeof menu === "string") {
    return menu
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        name: line,
        price: "",
      }));
  }

  return [];
};

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

  const vendorImagesRaw = Array.isArray(vendorDetails?.images)
    ? vendorDetails.images
    : [];
  const plazaImagesRaw = Array.isArray(plaza?.images) ? plaza.images : [];

  const vendorImages = getValidImageList(vendorImagesRaw);
  const plazaImages = getValidImageList(plazaImagesRaw);

  const vendorImageUrl = vendorImages[0] || "";
  const plazaImageUrl = plazaImages[0] || "";

  const currentImageUrl = vendorImageUrl || plazaImageUrl || "";

  const carouselImages =
    (vendorImages.length > 0 ? vendorImages : plazaImages)
      .filter((img) => typeof img === "string" && img.startsWith("http"));

  const normalizedMenu = useMemo(
    () => normalizeMenuList(vendorDetails?.menu),
    [vendorDetails]
  );

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
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeButtonText, { color: FOOD_ORANGE }]}>
            X
          </Text>
        </Pressable>

        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: FOOD_ORANGE }]}>
            {plaza?.name || ""}
          </Text>

          {currentImageUrl ? (
            <Image
              source={{ uri: currentImageUrl }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: "#d1d5db",
              }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 180,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: "#d1d5db",
              }}
            />
          )}

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
            Horario: {vendorDetails?.schedule || "No disponible"}
          </Text>

          <ScrollView
            ref={menuScrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {!normalizedMenu.length ? (
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
              normalizedMenu.map((menuItem, index) => (
                <View
                  key={`menu-item-${index}`}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#374151", flex: 1 }}>
                    {menuItem.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: FOOD_ORANGE,
                      marginLeft: 12,
                    }}
                  >
                    {menuItem.price || "RD$0"}
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