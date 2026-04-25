import { StyleSheet } from "react-native";

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
    height: 80,
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "800",
  },
  headerTitle: {
    top: 5,
    left: 13,
    color: "#fff",
    fontSize: 26,
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

export default styles;