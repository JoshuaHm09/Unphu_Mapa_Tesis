import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./helpers/styles/adminBuildingFormStyles";
import { ToggleYesNo } from "./BuildingFormFields";

export default function BuildingFloorEditor({
  floorName,
  rooms,
  isOpen,
  onToggle,
  selectedRoomIndex,
  onSelectRoom,
  onUpdateRoomField,
}) {
  const selectedRoom =
    Array.isArray(rooms) && selectedRoomIndex !== null ? rooms[selectedRoomIndex] : null;

  const roomDescription = selectedRoom?.description ?? "";
  const acValue = selectedRoom?.AC ?? false;
  const projectorValue = selectedRoom?.projector ?? false;
  const capacityValue = selectedRoom?.capacity ?? "";

  const roomNameLower = (selectedRoom?.name || "").toLowerCase();

  const isAcademicRoom =
    roomNameLower.includes("aula") ||
    roomNameLower.includes("laboratorio") ||
    roomNameLower.includes("lab");

  return (
    <View style={styles.floorBlock}>
      <Pressable style={styles.floorHeader} onPress={onToggle}>
        <Text style={styles.floorTitle}>{floorName}</Text>
        <Text style={styles.floorArrow}>{isOpen ? "⌃" : "⌄"}</Text>
      </Pressable>

      {isOpen && (
        <View style={styles.floorContent}>
          {Array.isArray(rooms) && rooms.length > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.roomTabsRow}
              >
                {rooms.map((room, index) => {
                  const isSelected = selectedRoomIndex === index;

                  return (
                    <Pressable
                      key={`${floorName}-${index}`}
                      style={[styles.roomTab, isSelected && styles.roomTabActive]}
                      onPress={() => onSelectRoom(index)}
                    >
                      <Text
                        style={[styles.roomTabText, isSelected && styles.roomTabTextActive]}
                        numberOfLines={1}
                      >
                        {room?.name || `Espacio ${index + 1}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {selectedRoom && (
                <View style={styles.roomEditorCard}>
                  <Text style={styles.roomEditorTitle}>
                    {selectedRoom?.name || "Espacio"}
                  </Text>

                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedRoom?.name || ""}
                    onChangeText={(text) =>
                      onUpdateRoomField(selectedRoomIndex, "name", text)
                    }
                    placeholder="Nombre del aula o espacio"
                    placeholderTextColor="#aaa"
                  />

                  <Text style={styles.label}>Descripcion</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={roomDescription}
                    onChangeText={(text) =>
                      onUpdateRoomField(selectedRoomIndex, "description", text)
                    }
                    placeholder="Descripción"
                    multiline
                    placeholderTextColor="#aaa"
                  />

                  {isAcademicRoom && (
                    <>
                      <ToggleYesNo
                        label="AC"
                        value={!!acValue}
                        onChange={(value) =>
                          onUpdateRoomField(selectedRoomIndex, "AC", value)
                        }
                      />

                      <ToggleYesNo
                        label="Proyector"
                        value={!!projectorValue}
                        onChange={(value) =>
                          onUpdateRoomField(selectedRoomIndex, "projector", value)
                        }
                      />

                      <View style={styles.fieldBlock}>
                        <Text style={styles.label}>Capacidad de aula</Text>
                        <TextInput
                          style={styles.input}
                          value={String(capacityValue)}
                          onChangeText={(text) => {
                            const numeric = text.replace(/[^0-9]/g, "");
                            const parsed = numeric === "" ? "" : Math.min(Number(numeric), 1000);
                            onUpdateRoomField(selectedRoomIndex, "capacity", parsed);
                          }}
                          keyboardType="numeric"
                          placeholder="0 - 1000"
                          placeholderTextColor="#aaa"
                        />
                      </View>
                    </>
                  )}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyFloorBox}>
              <Text style={styles.emptyFloorText}>
                Este piso no tiene espacios cargados.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}