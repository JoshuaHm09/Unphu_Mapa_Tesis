import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Keyboard } from "react-native";
import { Image } from "expo-image";

export default function SearchResults({
  styles,
  buildings,

  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  showSearchResults,
  setShowSearchResults,

  onPickBuilding,
}) {
  const items = useMemo(() => {
    const all = [];
    (buildings || []).forEach((b) => {
      all.push({
        id: `b-${b.id}`,
        type: "building",
        title: b.name,
        subtitle: b.subtitle || "Edificio",
        building: b,
        matchText: `${b.name} ${b.subtitle || ""}`.toLowerCase(),
      });

      if (b.floors) {
        Object.entries(b.floors).forEach(([floorName, rooms]) => {
          rooms?.forEach((room) => {
            all.push({
              id: `room-${b.id}-${room.name}`,
              type: "room",
              title: room.name,
              subtitle: `${b.name} · ${floorName}`,
              building: b,
              floorName,
              matchText: `${room.name} ${b.name} ${floorName}`.toLowerCase(),
            });
          });
        });
      }
    });
    return all;
  }, [buildings]);

  const filteredResults = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => item.matchText.includes(q));
  }, [items, searchQuery]);

  const closeSearch = () => {
    setSearchFocused(false);
    setShowSearchResults(false);
    Keyboard.dismiss();
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      // Top bar + Buscador
      <View style={styles.topBarWrapper} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Image
            source={require("../../assets/uNPHU_LOGO.jpg")}
            style={styles.logoImage}
            contentFit="contain"
          />

          <View style={styles.searchBarNew}>
            <Image
              source={require("../../assets/lupa.png")}
              style={styles.searchIconNew}
              contentFit="contain"
            />

            <TextInput
              value={searchQuery ?? ""}
              onChangeText={(text) => {
                setSearchQuery(text);
                setSearchFocused(true);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchResults(true);
              }}
              placeholder="Buscar Aula, Edificio..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInputNew}
            />

            {!!searchQuery && searchQuery.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                  setSearchFocused(false);
                  Keyboard.dismiss();
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      // Search Results
      {showSearchResults && filteredResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredResults.slice(0, 8).map((item) => (
              <Pressable
                key={item.id}
                style={styles.searchResultItem}
                onPress={() => {
                  setSearchQuery(item.title);
                  closeSearch();
                  onPickBuilding(item.building);
                }}
              >
                <Text style={styles.searchResultTitle}>{item.title}</Text>
                <Text style={styles.searchResultSubtitle}>{item.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      //Overlay para closing
      {(searchFocused || showSearchResults) && (
        <Pressable style={styles.globalTapClose} onPress={closeSearch} />
      )}
    </View>
  );
}
