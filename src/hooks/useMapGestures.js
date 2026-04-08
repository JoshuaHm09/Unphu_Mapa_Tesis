import { useEffect } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const clamp = (v, a, b) => {
  "worklet";
  return Math.min(Math.max(v, a), b);
};

export default function useMapGestures({
  imgWidth,
  imgHeight,
  screenWidth,
  screenHeight,
}) {
  const minScale = Math.min(screenWidth / imgWidth, screenHeight / imgHeight);
  const maxScale = 1;

  const scale = useSharedValue(minScale * 1.5);
  const savedScale = useSharedValue(minScale);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    const initialScale = minScale * 3;
    scale.value = initialScale;

    const offsetX = -(imgWidth * initialScale - screenWidth) / 10000;
    const offsetY = -(imgHeight * initialScale - screenHeight) / 10;

    translateX.value = offsetX;
    translateY.value = offsetY;
  }, [imgWidth, imgHeight, screenWidth, screenHeight, minScale, scale, translateX, translateY]);

  const clampToBounds = () => {
    "worklet";
    const maxTx = Math.max(0, (imgWidth * scale.value - screenWidth) / 2);
    const maxTy = Math.max(0, (imgHeight * scale.value - screenHeight) / 2);

    translateX.value = withTiming(clamp(translateX.value, -maxTx, maxTx));
    translateY.value = withTiming(clamp(translateY.value, -maxTy, maxTy));
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((ev) => {
      if (scale.value <= minScale + 0.01) {
        translateX.value = 0;
        translateY.value = 0;
        return;
      }

      translateX.value = savedTranslateX.value + ev.translationX;
      translateY.value = savedTranslateY.value + ev.translationY;
    })
    .onEnd(() => clampToBounds());

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((ev) => {
      scale.value = clamp(savedScale.value * ev.scale, minScale, maxScale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      clampToBounds();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const recenterMap = () => {
    const initialScale = minScale * 1.5;

    scale.value = withTiming(initialScale, { duration: 300 });

    const offsetX = -(imgWidth * initialScale - screenWidth) / 1000;
    const offsetY = -(imgHeight * initialScale - screenHeight) / 500;

    translateX.value = withTiming(offsetX, { duration: 300 });
    translateY.value = withTiming(offsetY, { duration: 300 });
  };

  const focusBuilding = (b) => {
    const targetScale = minScale * 3;
    scale.value = withTiming(targetScale);

    const offsetX = (b.x - imgWidth / 2) * targetScale;
    const offsetY = (b.y - imgHeight / 2) * targetScale;

    translateX.value = withTiming(-offsetX);
    translateY.value = withTiming(-offsetY);
  };

  return {
    minScale,
    maxScale,
    scale,
    translateX,
    translateY,
    composedGesture,
    animatedStyle,
    recenterMap,
    focusBuilding,
  };
}