import { StyleSheet, Dimensions } from "react-native";

const BUILDING_GREEN = "#34A853";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ECFAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
    zIndex: -1,
  },

  topBarWrapper: {
    position: "absolute",
    height: 90,
    top: 20,
    left: 0,
    right: 0,
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 14,
    paddingBottom: 10,
    zIndex: 100,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  logoImage: {
    width: 75,
    height: 28,
    marginRight: 10,
    resizeMode: "contain",
  },

  searchBarNew: {

    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 10,
  },

  searchIconNew: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#9CA3AF",
  },

  searchInputNew: {
    flex: 1,
    fontSize: 15,
    lineHeight: 18,
    color: "#111827",
    paddingVertical: 0,
  },

  clearButton: {
    position: "absolute",
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 2,
  },

  clearButtonText: {
    fontSize: 25,
    color: "#9CA3AF",
    fontWeight: "bold",
    marginLeft: 6,
  },

  searchResultsContainer: {
    position: "absolute",
    top: 150,
    left: 15,
    right: 15,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: 367,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
    paddingVertical: 4,
  },

  searchResultItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  searchResultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  searchResultSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  globalTapClose: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.001)",
    zIndex: 20,
  },

  buildingModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenModal: {
    width: "94%",
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
  },

  modalHeader: {
    backgroundColor: BUILDING_GREEN,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },

  modalHeaderTextWrapper: {
    alignItems: "center",
    paddingRight: 40,
  },

  modalHeaderTitle: {
    fontSize: 35,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    left: 25,
  },

  modalHeaderSubtitle: {
    marginTop: 4,
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    left: 25,
  },

  modalHeaderClose: {
    position: "absolute",
    right: -5,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  modalHeaderCloseText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    right: 12,
    top: 12,
  },

  modalBody: {
    flex: 1,
  },

  modalTabsWrapper: {
    marginTop: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },

  modalInner: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#F9F8F6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  tabScrollViewContainer: {
    marginTop: 8,
    marginBottom: 6,
  },

  tabContainer: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  tab: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 5,
  },

  tabText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
  },

  activeTabText: {
    color: "#fff",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "78%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  modalContent: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 1,
    padding: 5,
  },

  closeButtonText: {
    fontWeight: "bold",
    fontSize: 28,
  },

  pressableArea: {
    position: "absolute",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 0.1,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },

  cardIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 48,
    backgroundColor: BUILDING_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BUILDING_GREEN,
    backgroundColor: "rgba(52,168,83,0.08)",
    marginRight: 8,
  },

  badgeIcon: {
    width: 20.8,
    height: 18,
    marginRight: 4,
    resizeMode: "contain",
  },

  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: BUILDING_GREEN,
  },

  badgeOff: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },

  badgeOffOverlay: {
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#F84C4C",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeOffX: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  recenterCircle: {
    position: "absolute",
    left: 20,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },

  recenterIcon: {
    width: 26,
    height: 26,
    tintColor: "#333",
  },

  bottomMenuContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: -2 },
    elevation: 14,
    zIndex: 99999999,
    paddingBottom: 40,
  },

  bottomMenuButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
});