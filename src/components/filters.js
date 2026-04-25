import React from "react";
import { View, Pressable, Image } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

export const FILTER_ICONS = {
  buildings: require("../../assets/building_icon_green.png"),
  foodPlaza: require("../../assets/comida.png"),
  bathrooms: require("../../assets/icons/bathroom_locator.png"),
  vending: require("../../assets/icons/vending_machine_locator.png"),
  parking: require("../../assets/icons/parqueos_locator.png"),
  labs: require("../../assets/icons/lab_black_locator.png"),
  greenAreas: require("../../assets/icons/arbol_locator.png"),
  studyAreas: require("../../assets/icons/study_locator.png"),
};

const MAIN_GREEN = "#34A853";
const ACTIVE_BORDER = "rgba(52,168,83,0.45)";

function CircleButton({ icon, isActive, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: isActive ? 2 : 1,
        borderColor: isActive ? ACTIVE_BORDER : "rgba(0,0,0,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 26, height: 26 }}
      />
    </Pressable>
  );
}

function FiltersInner({
  filters,
  setFilters,
  visible,
  onClose,
  showBuildings,
  setShowBuildings,
  showFoodPlaza,
  setShowFoodPlaza,
}) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, {
      duration: visible ? 220 : 180,
    });
  }, [visible, progress]);

  const stackStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * -14 },
      { scale: 0.97 + progress.value * 0.03 },
    ],
  }));

  const filterItems = React.useMemo(
    () => [
      { key: "buildings", label: "Edificios" },
      { key: "foodPlaza", label: "Comida" },
      { key: "bathrooms", label: "Baños" },
      { key: "vending", label: "Máquinas" },
      { key: "parking", label: "Parqueos" },
      { key: "greenAreas", label: "Áreas Verdes" },
      { key: "studyAreas", label: "Salas de Estudio" },
      { key: "labs", label: "Laboratorios" },
    ],
    []
  );

  const toggleFilter = (key) => {
    if (key === "buildings") {
      setShowBuildings((prev) => !prev);
      return;
    }

    if (key === "foodPlaza") {
      setShowFoodPlaza((prev) => !prev);
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        right: 18,
        top: 140,
        zIndex: 20,
      }}
    >
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: visible ? MAIN_GREEN : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.14,
          shadowRadius: 10,
          elevation: 10,
          borderWidth: visible ? 0 : 1,
          borderColor: "rgba(0,0,0,0.06)",
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 18,
              height: 3,
              borderRadius: 2,
              backgroundColor: visible ? "#FFFFFF" : MAIN_GREEN,
            }}
          />
          {!visible && (
            <View
              style={{
                position: "absolute",
                width: 3,
                height: 18,
                borderRadius: 2,
                backgroundColor: MAIN_GREEN,
              }}
            />
          )}
        </View>
      </Pressable>

      {visible && (
        <Animated.View
          pointerEvents="auto"
          style={[
            stackStyle,
            {
              position: "absolute",
              top: 70,
              right: -3,
              paddingVertical: 10,
              paddingHorizontal: 8,
              borderRadius: 30,
              backgroundColor: "rgba(255,255,255,0.96)",
              alignItems: "center",
              gap: 12,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 10,
            },
          ]}
        >
          {filterItems.map((item) => {
            const isActive =
              item.key === "buildings"
                ? !!showBuildings
                : item.key === "foodPlaza"
                ? !!showFoodPlaza
                : !!filters[item.key];

            return (
              <CircleButton
                key={item.key}
                icon={FILTER_ICONS[item.key]}
                isActive={isActive}
                onPress={() => toggleFilter(item.key)}
              />
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

export default React.memo(FiltersInner);