import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../utils/supabase";
import FoodVendorList from "./FoodVendorList";

import styles from "./helpers/styles/adminFoodFormStyles";
import {
  buildVendorsObjectForSave,
  getFirstValidImage,
  normalizeVendorObject,
} from "./helpers/adminFoodHelpers";

import FoodVendorEditor from "./FoodVendorEditor";
import BuildingFloorEditor from "./BuildingFloorEditor";

const FOOD_VENDOR_BUCKET = "images";

export default function AdminFoodFormScreen({ foodPlace, onBack, onSaved }) {
  if (!foodPlace) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No hay lugar de comida seleccionado.</Text>

        <Pressable style={styles.fallbackButton} onPress={onBack}>
          <Text style={styles.fallbackButtonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const initialVendors = useMemo(() => {
    return normalizeVendorObject(foodPlace?.vendors);
  }, [foodPlace]);

  const [vendors, setVendors] = useState(initialVendors);
  const [selectedVendorIndex, setSelectedVendorIndex] = useState(
    initialVendors.length > 0 ? 0 : null
  );
  const [uploading, setUploading] = useState(false);

  const selectedVendor =
    selectedVendorIndex !== null ? vendors[selectedVendorIndex] : null;

  const vendorImageUrl = getFirstValidImage(selectedVendor?.images);
  const plazaImageUrl = getFirstValidImage(foodPlace?.images);
  const currentImageUrl = vendorImageUrl || plazaImageUrl || "";

  const addVendor = () => {
    setVendors((prev) => {
      const next = [
        ...prev,
        {
          id: `vendor_${Date.now()}`,
          originalKey: "",
          name: "",
          schedule: "",
          menu: [],
          images: [],
        },
      ];

      setSelectedVendorIndex(next.length - 1);
      return next;
    });
  };

  const selectVendor = (index) => {
    setSelectedVendorIndex(index);
  };

  const updateVendorField = (field, value) => {
    if (selectedVendorIndex === null) return;

    setVendors((prev) =>
      prev.map((vendor, index) =>
        index === selectedVendorIndex ? { ...vendor, [field]: value } : vendor
      )
    );
  };

  const addMenuItem = () => {
    if (selectedVendorIndex === null) return;

    setVendors((prev) =>
      prev.map((vendor, index) =>
        index === selectedVendorIndex
          ? {
              ...vendor,
              menu: [
                ...(vendor.menu || []),
                {
                  id: `menu_${Date.now()}`,
                  name: "",
                  price: "",
                },
              ],
            }
          : vendor
      )
    );
  };

  const updateMenuItem = (id, field, value) => {
    if (selectedVendorIndex === null) return;

    setVendors((prev) =>
      prev.map((vendor, index) =>
        index === selectedVendorIndex
          ? {
              ...vendor,
              menu: (vendor.menu || []).map((item) => {
                if (item.id !== id) return item;

                if (field === "price") {
                  const numeric = String(value).replace(/[^0-9]/g, "");
                  return {
                    ...item,
                    price: numeric ? `RD$${numeric}` : "",
                  };
                }

                return {
                  ...item,
                  [field]: value,
                };
              }),
            }
          : vendor
      )
    );
  };

  const removeMenuItem = (id) => {
    if (selectedVendorIndex === null) return;

    setVendors((prev) =>
      prev.map((vendor, index) =>
        index === selectedVendorIndex
          ? {
              ...vendor,
              menu: (vendor.menu || []).filter((item) => item.id !== id),
            }
          : vendor
      )
    );
  };

  const removeVendor = () => {
    if (selectedVendorIndex === null) return;

    Alert.alert("Eliminar vendor", "¿Seguro que quieres eliminar este vendor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setVendors((prev) => {
            const next = prev.filter((_, index) => index !== selectedVendorIndex);

            if (next.length === 0) {
              setSelectedVendorIndex(null);
            } else if (selectedVendorIndex > 0) {
              setSelectedVendorIndex(selectedVendorIndex - 1);
            } else {
              setSelectedVendorIndex(0);
            }

            return next;
          });
        },
      },
    ]);
  };

  const replaceVendorImage = async () => {
    if (selectedVendorIndex === null) return;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitas permitir acceso a la galería para subir imágenes."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const uri = asset.uri;

      setUploading(true);

      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const ext =
        asset.fileName?.split(".").pop()?.toLowerCase() ||
        asset.mimeType?.split("/").pop()?.toLowerCase() ||
        uri.split(".").pop()?.toLowerCase() ||
        "jpg";

      const safeVendorName =
        (selectedVendor?.name || `vendor_${selectedVendorIndex}`)
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_-]/g, "") || `vendor_${selectedVendorIndex}`;

      const fileName = `food/${foodPlace.id}/${safeVendorName}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(FOOD_VENDOR_BUCKET)
        .upload(fileName, arrayBuffer, {
          contentType: asset.mimeType || `image/${ext}`,
          upsert: true,
        });

      if (uploadError) {
        setUploading(false);
        Alert.alert("Error subiendo imagen", uploadError.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from(FOOD_VENDOR_BUCKET)
        .getPublicUrl(fileName);

      const publicUrl = publicData?.publicUrl;

      if (!publicUrl) {
        setUploading(false);
        Alert.alert("Error", "No se pudo obtener la URL pública.");
        return;
      }

      setVendors((prev) =>
        prev.map((vendor, index) => {
          if (index !== selectedVendorIndex) return vendor;

          return {
            ...vendor,
            images: [publicUrl],
          };
        })
      );

      setUploading(false);
    } catch (error) {
      setUploading(false);
      Alert.alert("Error", error.message || "No se pudo subir la imagen.");
    }
  };

  const removeVendorImage = () => {
    if (selectedVendorIndex === null) return;

    setVendors((prev) =>
      prev.map((vendor, index) =>
        index === selectedVendorIndex
          ? {
              ...vendor,
              images: [],
            }
          : vendor
      )
    );
  };

  const handleSave = async () => {
    const vendorsPayload = buildVendorsObjectForSave(vendors);

    const payload = {
      vendors: vendorsPayload,
    };

    const { data, error } = await supabase
      .from("food_places")
      .update(payload)
      .eq("id", foodPlace.id)
      .select();

    if (error) {
      Alert.alert("Error al guardar", error.message);
      return;
    }

    if (!data || data.length === 0) {
      Alert.alert(
        "No se guardó",
        "No se actualizó ninguna fila. Revisa el id o las policies de Supabase."
      );
      return;
    }

    Alert.alert("Éxito", "Cambios guardados correctamente.");
    if (onSaved) onSaved(data[0]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Editar Comida</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>{foodPlace?.name || "Lugar de comida"}</Text>
        <Text style={styles.pageSubtitle}>
          Selecciona un vendor para editarlo
        </Text>

        <View style={styles.formCard}>
          <FoodVendorList
            vendors={vendors}
            selectedVendorIndex={selectedVendorIndex}
            onSelectVendor={selectVendor}
            onAddVendor={addVendor}
          />

          <FoodVendorEditor
            selectedVendor={selectedVendor}
            currentImageUrl={currentImageUrl}
            uploading={uploading}
            updateVendorField={updateVendorField}
            addMenuItem={addMenuItem}
            updateMenuItem={updateMenuItem}
            removeMenuItem={removeMenuItem}
            replaceVendorImage={replaceVendorImage}
            removeVendorImage={removeVendorImage}
            removeVendor={removeVendor}
          />

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}