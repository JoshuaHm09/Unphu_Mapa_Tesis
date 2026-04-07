import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { supabase } from "../../utils/supabase";

const FOOD_VENDOR_BUCKET = "images";

const asObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
};

const normalizeImagesArray = (images) => {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images
      .map((img) => {
        if (typeof img === "string") return img.trim();

        if (img && typeof img === "object") {
          return (img.url || img.src || "").trim();
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof images === "string") {
    const trimmed = images.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed
          .map((img) => {
            if (typeof img === "string") return img.trim();

            if (img && typeof img === "object") {
              return (img.url || img.src || "").trim();
            }

            return "";
          })
          .filter(Boolean);
      }
    } catch (error) {
      // si no es JSON, seguimos normal
    }

    return [trimmed];
  }

  return [];
};

const getFirstValidImage = (images) => {
  if (!images) return "";

  if (Array.isArray(images)) {
    for (const img of images) {
      if (typeof img === "string" && img.trim()) return img.trim();

      if (img && typeof img === "object") {
        const url = (img.url || img.src || "").trim();
        if (url) return url;
      }
    }
  }

  if (typeof images === "string") {
    const normalized = normalizeImagesArray(images);
    return normalized[0] || "";
  }

  return "";
};

const normalizeVendorObject = (vendorsObject) => {
  const safeObject = asObject(vendorsObject);

  return Object.entries(safeObject).map(([vendorName, vendorData], index) => ({
    id: vendorData?.id || `vendor_${index}_${Date.now()}`,
    originalKey: vendorName,
    name: vendorName || "",
    schedule: vendorData?.schedule || "",
    menu: Array.isArray(vendorData?.menu)
      ? vendorData.menu.map((item, i) => ({
          id: item?.id || `menu_${index}_${i}_${Date.now()}`,
          name: item?.name || item?.item || item?.title || "",
          price:
            item?.price != null
              ? String(item.price).replace(/^RD\$\s*/i, "RD$")
              : "",
        }))
      : [],
    images: normalizeImagesArray(vendorData?.images).map((img, i) => ({
      id: `img_${index}_${i}_${Date.now()}`,
      url: img,
    })),
  }));
};

const cleanMenu = (items) =>
  items
    .map((item) => ({
      name: (item.name || "").trim(),
      price: (item.price || "").trim(),
    }))
    .filter((item) => item.name || item.price);

const cleanImages = (items) =>
  items
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") return (item.url || item.src || "").trim();
      return "";
    })
    .filter(Boolean);

const buildVendorsObjectForSave = (vendorsArray) => {
  const result = {};

  vendorsArray.forEach((vendor) => {
    const cleanName = (vendor.name || "").trim();
    if (!cleanName) return;

    result[cleanName] = {
      schedule: (vendor.schedule || "").trim(),
      menu: cleanMenu(vendor.menu || []),
      images: cleanImages(vendor.images || []),
    };
  });

  return result;
};

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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vendors</Text>
            <Pressable style={styles.addButton} onPress={addVendor}>
              <Text style={styles.addButtonText}>+ Agregar vendor</Text>
            </Pressable>
          </View>

          {vendors.length === 0 ? (
            <Text style={styles.emptyText}>No hay vendors cargados.</Text>
          ) : (
            vendors.map((vendor, index) => {
              const isSelected = selectedVendorIndex === index;
              const menuCount = Array.isArray(vendor.menu) ? vendor.menu.length : 0;

              return (
                <Pressable
                  key={vendor.id || index}
                  style={[styles.vendorCard, isSelected && styles.vendorCardActive]}
                  onPress={() => selectVendor(index)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vendorTitle}>
                      {vendor.name || `Vendor ${index + 1}`}
                    </Text>
                    <Text style={styles.vendorSub}>
                      {vendor.schedule || "Sin horario"}
                    </Text>
                    <Text style={styles.vendorMeta}>
                      {menuCount} item{menuCount === 1 ? "" : "s"} en menú
                    </Text>
                  </View>

                  <Text style={styles.arrow}>›</Text>
                </Pressable>
              );
            })
          )}

          {selectedVendor && (
            <View style={styles.editorWrap}>
              <Text style={styles.editorTitle}>
                Editando: {selectedVendor.name || "Vendor sin nombre"}
              </Text>

              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={selectedVendor.name}
                onChangeText={(text) => updateVendorField("name", text)}
                placeholder="Ej. Helados Bon"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Horario</Text>
              <TextInput
                style={styles.input}
                value={selectedVendor.schedule}
                onChangeText={(text) => updateVendorField("schedule", text)}
                placeholder="Ej. 11:00 AM - 6:00 PM"
                placeholderTextColor="#aaa"
              />

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Menú</Text>
                <Pressable style={styles.addButton} onPress={addMenuItem}>
                  <Text style={styles.addButtonText}>+ Agregar item</Text>
                </Pressable>
              </View>

              {(selectedVendor.menu || []).length === 0 ? (
                <Text style={styles.emptyText}>No hay items en el menú.</Text>
              ) : (
                (selectedVendor.menu || []).map((item) => (
                  <View key={item.id} style={styles.groupCard}>
                    <Text style={styles.label}>Item</Text>
                    <TextInput
                      style={styles.input}
                      value={item.name}
                      onChangeText={(text) => updateMenuItem(item.id, "name", text)}
                      placeholder="Ej. Hot Dog"
                      placeholderTextColor="#aaa"
                    />

                    <Text style={styles.label}>Precio</Text>
                    <TextInput
                      style={styles.input}
                      value={item.price ? item.price.replace(/^RD\$/i, "") : ""}
                      onChangeText={(text) => updateMenuItem(item.id, "price", text)}
                      placeholder="Ej. 150"
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                    />

                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeMenuItem(item.id)}
                    >
                      <Text style={styles.removeButtonText}>Eliminar item</Text>
                    </Pressable>
                  </View>
                ))
              )}

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Imagen actual</Text>
              </View>

              <View style={styles.groupCard}>
                {currentImageUrl ? (
                  <Image
                    source={{ uri: currentImageUrl }}
                    style={styles.previewImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <View style={styles.emptyImageBox} />
                )}

                <View style={styles.actionsRow}>
                  <Pressable style={styles.addButton} onPress={replaceVendorImage}>
                    <Text style={styles.addButtonText}>
                      {uploading ? "Subiendo..." : "Reemplazar"}
                    </Text>
                  </Pressable>

                  <Pressable style={styles.removeButton} onPress={removeVendorImage}>
                    <Text style={styles.removeButtonText}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.deleteVendorButton} onPress={removeVendor}>
                <Text style={styles.deleteVendorButtonText}>Eliminar vendor</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 20,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  fallbackButton: {
    marginTop: 18,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fallbackButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    height: 80,
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "800",
  },
  headerTitle: {
    top: 5,
    left: 10,
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },
  addButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  vendorCard: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  vendorCardActive: {
    borderColor: "#f59e0b",
    borderWidth: 2,
    backgroundColor: "#fffaf0",
  },
  vendorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  vendorSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  vendorMeta: {
    fontSize: 12,
    color: "#f59e0b",
    marginTop: 5,
    fontWeight: "700",
  },
  arrow: {
    fontSize: 26,
    color: "#666",
    marginLeft: 10,
  },
  editorWrap: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    paddingTop: 16,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  groupCard: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  removeButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  deleteVendorButton: {
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#dc2626",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteVendorButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: "#f59e0b",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#d1d5db",
  },
  emptyImageBox: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#d1d5db",
  },
});