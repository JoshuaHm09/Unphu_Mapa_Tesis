import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./helpers/styles/adminBuildingFormStyles";
import {
  formatDateLatin,
  formatTimeLatin,
} from "./helpers/adminBuildingFormHelpers";

export function ToggleYesNo({ label, value, onChange }) {
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

export function EventModalityToggle({ value, onChange }) {
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

export function DateField({ label, value, onChange }) {
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

export function TimeField({ label, value, onChange }) {
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