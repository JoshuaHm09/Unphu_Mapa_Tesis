import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
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
  onAddRoom,
  onDeleteRoom,
  onDeleteFloor,
}) {
  const selectedRoom =
    Array.isArray(rooms) && selectedRoomIndex !== null
      ? rooms[selectedRoomIndex]
      : null;

  const roomDescription = selectedRoom?.description ?? "";
  const acValue = selectedRoom?.AC === true;
  const projectorValue = selectedRoom?.projector === true;
  const capacityValue = selectedRoom?.capacity ?? "";

 const normalizeText = (text = "") =>
   String(text)
     .toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .trim();

 const roomNameLower = normalizeText(selectedRoom?.name || "");

 const isAcademicRoom =
   roomNameLower.length > 0 &&
   (roomNameLower.startsWith("aula") ||
     roomNameLower.startsWith("laboratorio") ||
     roomNameLower.startsWith("lab "));

  const renderRightActions = () => (
    <Pressable
        onPress={onDeleteFloor}
        style={{
          backgroundColor: "#DC2626",
          justifyContent: "center",
          alignItems: "center",
          width: 150,
          paddingHorizontal: 14,
          paddingVertical: 16,
          borderRadius: 12,
          alignSelf: "flex-start",

        }}
      >
      <Text style={{ color: "#fff", fontWeight: "900" }}>Eliminar</Text>
    </Pressable>
  );

  return (
      <View style={styles.floorBlock}>
        <Swipeable renderRightActions={renderRightActions}>
          <Pressable style={styles.floorHeader} onPress={onToggle}>
            <Text style={styles.floorTitle}>{floorName}</Text>
            <Text style={styles.floorArrow}>{isOpen ? "⌃" : "⌄"}</Text>
          </Pressable>
        </Swipeable>

        {isOpen && (
          <View style={styles.floorContent}>
            <Pressable
              onPress={onAddRoom}
              style={{
                backgroundColor: "#16a34a",
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                Agregar espacio +
              </Text>
            </Pressable>

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
                        style={[
                          styles.roomTab,
                          isSelected && styles.roomTabActive,
                        ]}
                        onPress={() => onSelectRoom(index)}
                      >
                        <Text
                          style={[
                            styles.roomTabText,
                            isSelected && styles.roomTabTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {room?.name || `Espacio ${index + 1}`}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {selectedRoom && (
                  <View style={[styles.roomEditorCard, { position: "relative" }]}>
                    <Pressable
                      onPress={() => onDeleteRoom(selectedRoomIndex)}
                      hitSlop={10}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "#FEE2E2",
                        borderWidth: 1,
                        borderColor: "#FCA5A5",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 10,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#DC2626",
                          fontSize: 12,
                          fontWeight: "900",
                        }}
                      >
                        Eliminar
                      </Text>
                    </Pressable>

                    <Text style={[styles.roomEditorTitle, { paddingRight: 75 }]}>
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
                          value={acValue}
                          onChange={(value) =>
                            onUpdateRoomField(selectedRoomIndex, "AC", value)
                          }
                        />

                        <ToggleYesNo
                          label="Proyector"
                          value={projectorValue}
                          onChange={(value) =>
                            onUpdateRoomField(
                              selectedRoomIndex,
                              "projector",
                              value
                            )
                          }
                        />

                        <View style={styles.fieldBlock}>
                          <Text style={styles.label}>Capacidad de aula</Text>
                          <TextInput
                            style={styles.input}
                            value={String(capacityValue)}
                            onChangeText={(text) => {
                              const numeric = text.replace(/[^0-9]/g, "");
                              const parsed =
                                numeric === ""
                                  ? ""
                                  : Math.min(Number(numeric), 1000);

                              onUpdateRoomField(
                                selectedRoomIndex,
                                "capacity",
                                parsed
                              );
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