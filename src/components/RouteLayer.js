import React from "react";
import { View } from "react-native";

export default function RouteLayer({ path }) {
  if (!Array.isArray(path) || path.length < 2) return null;

  const dots = [];

  path.slice(0, -1).forEach((point, index) => {
    const nextPoint = path[index + 1];

    if (!point || !nextPoint) return;

    const dx = nextPoint.x - point.x;
    const dy = nextPoint.y - point.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const spacing = 38;

    const steps = Math.floor(distance / spacing);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      const x = point.x + dx * t;
      const y = point.y + dy * t;

      dots.push(
        <View
          key={`dot-${index}-${i}`}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: x - 9,
            top: y - 9,

            width: 20,
            height: 20,
            borderRadius: 25,

            backgroundColor: "#2A00FF",

            borderWidth: 3,
            borderColor: "white",

            shadowColor: "#38BDF8",
            shadowOpacity: 0.9,
            shadowRadius: 6,
            shadowOffset: {
              width: 0,
              height: 0,
            },

            elevation: 12,
            zIndex: 30,
          }}
        />
      );
    }
  });

  return <>{dots}</>;
}