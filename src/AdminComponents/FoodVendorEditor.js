import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import styles from "./helpers/styles/adminFoodFormStyles";

export default function FoodVendorEditor({
  selectedVendor,
  currentImageUrl,
  uploading,
  updateVendorField,
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
  replaceVendorImage,
  removeVendorImage,
  removeVendor,
}) {
  if (!selectedVendor) return null;

  return (
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
  );
}