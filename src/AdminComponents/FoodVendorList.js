import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./helpers/styles/adminFoodFormStyles";

export default function FoodVendorList({
  vendors,
  selectedVendorIndex,
  onSelectVendor,
  onAddVendor,
}) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vendors</Text>
        <Pressable style={styles.addButton} onPress={onAddVendor}>
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
              onPress={() => onSelectVendor(index)}
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
    </>
  );
}