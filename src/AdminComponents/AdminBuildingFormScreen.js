import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../utils/supabase";

function ToggleYesNo({ label, value, onChange }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleButton, value === true && styles.toggleActiveYes]}
          onPress={() => onChange(true)}
        >
          <Text style={[styles.toggleText, value === true && styles.toggleTextActive]}>
            SI
          </Text>
        </Pressable>

        <Text style={styles.toggleDivider}>/</Text>

        <Pressable
          style={[styles.toggleButton, value === false && styles.toggleActiveNo]}
          onPress={() => onChange(false)}
        >
          <Text style={[styles.toggleText, value === false && styles.toggleTextActive]}>
            NO
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function EventModalityToggle({ value, onChange }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>Modalidad</Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[
            styles.toggleButton,
            value === "presencial" && styles.toggleActiveYes,
          ]}
          onPress={() => onChange("presencial")}
        >
          <Text
            style={[
              styles.toggleText,
              value === "presencial" && styles.toggleTextActive,
            ]}
          >
            Presencial
          </Text>
        </Pressable>

        <Text style={styles.toggleDivider}>/</Text>

        <Pressable
          style={[
            styles.toggleButton,
            value === "virtual" && styles.toggleActiveNo,
          ]}
          onPress={() => onChange("virtual")}
        >
          <Text
            style={[
              styles.toggleText,
              value === "virtual" && styles.toggleTextActive,
            ]}
          >
            Virtual
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatDateLatin(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTimeLatin(value) {
  if (!value) return "";

  const date = new Date(`2026-01-01T${value}:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function DateField({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {value ? formatDateLatin(value) : "Selecciona una fecha"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, pickedDate) => {
            if (Platform.OS !== "ios") {
              setShowPicker(false);
            }

            if (!pickedDate) return;

            const year = pickedDate.getFullYear();
            const month = String(pickedDate.getMonth() + 1).padStart(2, "0");
            const day = String(pickedDate.getDate()).padStart(2, "0");

            onChange(`${year}-${month}-${day}`);
          }}
        />
      )}

      {Platform.OS === "ios" && showPicker && (
        <Pressable
          style={styles.donePickerButton}
          onPress={() => setShowPicker(false)}
        >
          <Text style={styles.donePickerButtonText}>Listo</Text>
        </Pressable>
      )}
    </View>
  );
}

function TimeField({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedTime = value
    ? new Date(`2026-01-01T${value}:00`)
    : new Date(`2026-01-01T12:00:00`);

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {value ? formatTimeLatin(value) : "Selecciona una hora"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, pickedTime) => {
            if (Platform.OS !== "ios") {
              setShowPicker(false);
            }

            if (!pickedTime) return;

            const hours = String(pickedTime.getHours()).padStart(2, "0");
            const minutes = String(pickedTime.getMinutes()).padStart(2, "0");

            onChange(`${hours}:${minutes}`);
          }}
        />
      )}

      {Platform.OS === "ios" && showPicker && (
        <Pressable
          style={styles.donePickerButton}
          onPress={() => setShowPicker(false)}
        >
          <Text style={styles.donePickerButtonText}>Listo</Text>
        </Pressable>
      )}
    </View>
  );
}

function FloorEditor({
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
              <Text style={styles.emptyFloorText}>Este piso no tiene espacios cargados.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function EventEditor({
  event,
  index,
  isOpen,
  onToggle,
  onUpdateField,
  onDelete,
}) {
  return (
    <View style={styles.floorBlock}>
      <Pressable style={styles.floorHeader} onPress={onToggle}>
        <Text style={styles.floorTitle}>
          {event?.name?.trim() || `Evento ${index + 1}`}
        </Text>
        <Text style={styles.floorArrow}>{isOpen ? "⌃" : "⌄"}</Text>
      </Pressable>

      {isOpen && (
        <View style={styles.floorContent}>
          <View style={styles.roomEditorCard}>
            <Text style={styles.roomEditorTitle}>
              {event?.name?.trim() || `Evento ${index + 1}`}
            </Text>

            <Text style={styles.label}>Nombre del evento</Text>
            <TextInput
              style={styles.input}
              value={event?.name || ""}
              onChangeText={(text) => onUpdateField(index, "name", text)}
              placeholder="Nombre del evento"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Subtitulo</Text>
            <TextInput
              style={styles.input}
              value={event?.subtitle || ""}
              onChangeText={(text) => onUpdateField(index, "subtitle", text)}
              placeholder="Subtítulo"
              placeholderTextColor="#aaa"
            />

            <DateField
              label="Fecha"
              value={event?.date || ""}
              onChange={(value) => onUpdateField(index, "date", value)}
            />

            <TimeField
              label="Hora de inicio"
              value={event?.startTime || ""}
              onChange={(value) => onUpdateField(index, "startTime", value)}
            />

            <TimeField
              label="Hora de fin"
              value={event?.endTime || ""}
              onChange={(value) => onUpdateField(index, "endTime", value)}
            />

            <Text style={styles.label}>Descripcion</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={event?.description || ""}
              onChangeText={(text) => onUpdateField(index, "description", text)}
              placeholder="Descripción del evento"
              multiline
              placeholderTextColor="#aaa"
            />

            <EventModalityToggle
              value={event?.modality || "presencial"}
              onChange={(value) => onUpdateField(index, "modality", value)}
            />

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Horas cocurriculares</Text>
              <TextInput
                style={styles.input}
                value={String(event?.cocurricularHours ?? "")}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "");
                  onUpdateField(
                    index,
                    "cocurricularHours",
                    numeric === "" ? "" : Number(numeric)
                  );
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#aaa"
              />
            </View>

            <Text style={styles.label}>Link del evento</Text>
            <TextInput
              style={styles.input}
              value={event?.link || ""}
              onChangeText={(text) => onUpdateField(index, "link", text)}
              placeholder="https://..."
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />

            <Pressable
              style={styles.deleteEventButton}
              onPress={() => onDelete(index)}
            >
              <Text style={styles.deleteEventButtonText}>Eliminar evento</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default function AdminBuildingFormScreen({ building, onBack, onSaved }) {
  if (!building) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No hay edificio seleccionado.</Text>

        <Pressable style={styles.fallbackButton} onPress={onBack}>
          <Text style={styles.fallbackButtonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const [name, setName] = useState(building?.name || "");
  const [subtitle, setSubtitle] = useState(building?.subtitle || "");
  const [x, setX] = useState(String(building?.x ?? ""));
  const [y, setY] = useState(String(building?.y ?? ""));
  const [radius, setRadius] = useState(String(building?.radius ?? ""));
  const [floors, setFloors] = useState(building?.floors || {});
  const [events, setEvents] = useState(building?.events || []);
  const [openFloors, setOpenFloors] = useState({});
  const [selectedRoomByFloor, setSelectedRoomByFloor] = useState({});
  const [openEvents, setOpenEvents] = useState({});

  const floorEntries = useMemo(() => Object.entries(floors || {}), [floors]);

  const toggleFloor = (floorName, rooms) => {
    setOpenFloors((prev) => {
      const nextOpen = !prev[floorName];

      if (nextOpen) {
        setSelectedRoomByFloor((prevSelected) => ({
          ...prevSelected,
          [floorName]:
            prevSelected[floorName] !== undefined
              ? prevSelected[floorName]
              : Array.isArray(rooms) && rooms.length > 0
              ? 0
              : null,
        }));
      }

      return {
        ...prev,
        [floorName]: nextOpen,
      };
    });
  };

  const selectRoom = (floorName, roomIndex) => {
    setSelectedRoomByFloor((prev) => ({
      ...prev,
      [floorName]: roomIndex,
    }));
  };

  const updateRoomField = (floorName, roomIndex, field, value) => {
    setFloors((prev) => {
      const currentFloor = prev?.[floorName];
      if (!Array.isArray(currentFloor)) return prev;

      const updatedRooms = [...currentFloor];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [field]: value,
      };

      return {
        ...prev,
        [floorName]: updatedRooms,
      };
    });
  };

  const addNewEvent = () => {
    const newEvent = {
      id: `evt_${Date.now()}`,
      name: "",
      subtitle: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      modality: "presencial",
      cocurricularHours: "",
      link: "",
    };

    setEvents((prev) => {
      const next = [...prev, newEvent];

      setOpenEvents((prevOpen) => ({
        ...prevOpen,
        [next.length - 1]: true,
      }));

      return next;
    });
  };

  const toggleEvent = (eventIndex) => {
    setOpenEvents((prev) => ({
      ...prev,
      [eventIndex]: !prev[eventIndex],
    }));
  };

  const updateEventField = (eventIndex, field, value) => {
    setEvents((prev) => {
      const updated = [...prev];
      updated[eventIndex] = {
        ...updated[eventIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const removeEvent = (eventIndex) => {
    Alert.alert(
      "Eliminar evento",
      "¿Seguro que quieres eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setEvents((prev) => prev.filter((_, index) => index !== eventIndex));

            setOpenEvents((prev) => {
              const rebuilt = {};
              Object.keys(prev).forEach((key) => {
                const numericKey = Number(key);

                if (numericKey < eventIndex) {
                  rebuilt[numericKey] = prev[key];
                } else if (numericKey > eventIndex) {
                  rebuilt[numericKey - 1] = prev[key];
                }
              });

              return rebuilt;
            });
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Falta información", "El edificio debe tener un nombre.");
      return;
    }

    const cleanedEvents = (events || []).map((event, index) => ({
      id: event?.id || `evt_${index + 1}`,
      name: event?.name?.trim() || "",
      subtitle: event?.subtitle?.trim() || "",
      date: event?.date?.trim() || "",
      startTime: event?.startTime?.trim() || "",
      endTime: event?.endTime?.trim() || "",
      description: event?.description?.trim() || "",
      modality: event?.modality || "presencial",
      cocurricularHours:
        event?.cocurricularHours === "" || event?.cocurricularHours == null
          ? ""
          : Number(event.cocurricularHours),
      link: event?.link?.trim() || "",
    }));

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim(),
      x: Number(x) || 0,
      y: Number(y) || 0,
      radius: Number(radius) || 0,
      floors,
      events: cleanedEvents,
    };

    const { data, error } = await supabase
      .from("buildings")
      .update(payload)
      .eq("id", building.id)
      .select();

    if (error) {
      Alert.alert("Error al guardar", error.message);
      return;
    }

    if (!data || data.length === 0) {
      Alert.alert(
        "No se guardó",
        "No se actualizó ninguna fila. Revisa el id del edificio o las policies de Supabase."
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

        <Text style={styles.headerTitle}>Editar Edificio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>{name || "Edificio"}</Text>
        <Text style={styles.pageSubtitle}>{subtitle || "Sin subtítulo"}</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Subtitulo</Text>
          <TextInput
            style={styles.input}
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Subtítulo"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Coordenadas</Text>
          <View style={styles.coordsRow}>
            <TextInput
              style={[styles.input, styles.coordInput]}
              value={x}
              onChangeText={setX}
              placeholder="X"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={[styles.input, styles.coordInput]}
              value={y}
              onChangeText={setY}
              placeholder="Y"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={styles.label}>Radio</Text>
          <TextInput
            style={styles.input}
            value={radius}
            onChangeText={setRadius}
            placeholder="Radio"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.sectionTitle}>Pisos</Text>

          {floorEntries.length === 0 ? (
            <View style={styles.emptyFloorBox}>
              <Text style={styles.emptyFloorText}>Este edificio no tiene pisos cargados.</Text>
            </View>
          ) : (
            floorEntries.map(([floorName, rooms]) => (
              <FloorEditor
                key={floorName}
                floorName={floorName}
                rooms={rooms}
                isOpen={!!openFloors[floorName]}
                onToggle={() => toggleFloor(floorName, rooms)}
                selectedRoomIndex={
                  selectedRoomByFloor[floorName] !== undefined
                    ? selectedRoomByFloor[floorName]
                    : null
                }
                onSelectRoom={(roomIndex) => selectRoom(floorName, roomIndex)}
                onUpdateRoomField={(roomIndex, field, value) =>
                  updateRoomField(floorName, roomIndex, field, value)
                }
              />
            ))
          )}

          <View style={styles.eventsSectionHeader}>
            <Text style={styles.sectionTitle}>Eventos</Text>

            <Pressable style={styles.addEventButton} onPress={addNewEvent}>
              <Text style={styles.addEventButtonText}>Agregar Evento +</Text>
            </Pressable>
          </View>

          {events.length === 0 ? (
            <View style={styles.emptyFloorBox}>
              <Text style={styles.emptyFloorText}>Este edificio no tiene eventos cargados.</Text>
            </View>
          ) : (
            events.map((event, index) => (
              <EventEditor
                key={event?.id || index}
                event={event}
                index={index}
                isOpen={!!openEvents[index]}
                onToggle={() => toggleEvent(index)}
                onUpdateField={updateEventField}
                onDelete={removeEvent}
              />
            ))
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
  },
  fallbackButton: {
    marginTop: 18,
    backgroundColor: "#16a34a",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  fallbackButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    height: 70,
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
    color: "#b0b0b0",
    marginTop: 8,
  },
  pageSubtitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#b0b0b0",
    marginBottom: 14,
  },
  formCard: {
    backgroundColor: "#e7e7e7",
    borderRadius: 16,
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#111",
  },
  placeholderText: {
    color: "#aaa",
  },
  donePickerButton: {
    marginTop: 10,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  donePickerButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  coordsRow: {
    flexDirection: "row",
    gap: 10,
  },
  coordInput: {
    flex: 1,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginTop: 22,
    marginBottom: 12,
  },
  emptyFloorBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  emptyFloorText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  floorBlock: {
    marginBottom: 14,
  },
  floorHeader: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  floorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    flex: 1,
    paddingRight: 10,
  },
  floorArrow: {
    fontSize: 18,
    color: "#555",
    fontWeight: "700",
  },
  floorContent: {
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 16,
    padding: 14,
  },
  roomTabsRow: {
    paddingBottom: 8,
  },
  roomTab: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    maxWidth: 180,
  },
  roomTabActive: {
    backgroundColor: "#16a34a",
  },
  roomTabText: {
    color: "#222",
    fontWeight: "700",
  },
  roomTabTextActive: {
    color: "#fff",
  },
  roomEditorCard: {
    marginTop: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  roomEditorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  fieldBlock: {
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },
  toggleButton: {
    minWidth: 58,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  toggleActiveYes: {
    backgroundColor: "#2563eb",
  },
  toggleActiveNo: {
    backgroundColor: "#dc2626",
  },
  toggleText: {
    color: "#222",
    fontWeight: "800",
  },
  toggleTextActive: {
    color: "#fff",
  },
  toggleDivider: {
    fontSize: 18,
    fontWeight: "800",
    color: "#555",
  },
  eventsSectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  addEventButton: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  addEventButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  deleteEventButton: {
    marginTop: 18,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteEventButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
});