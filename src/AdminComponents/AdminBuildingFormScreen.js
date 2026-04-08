import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../utils/supabase";
import styles from "./helpers/styles/adminBuildingFormStyles";
import {
  EventModalityToggle,
  DateField,
  TimeField,
} from "./BuildingFormFields";
import BuildingFloorEditor from "./BuildingFloorEditor";



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
              <BuildingFloorEditor
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