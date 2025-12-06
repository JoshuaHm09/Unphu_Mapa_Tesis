import React, { useRef, useState } from "react";
import { View, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ImageCarousel = ({ images, height = 200, noPadding = false }) => {
  const scrollViewRef = useRef(null);

  const [carouselWidth, setCarouselWidth] = useState(SCREEN_WIDTH - 60);

  const [imgLoading, setImgLoading] = useState(true);
  const fadeIn = useSharedValue(0);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const onLayout = (event) => {
    const w = event.nativeEvent.layout.width;
    setCarouselWidth(w);
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: noPadding ? 0 : 20,
        marginTop: noPadding ? 0 : 10,
        marginBottom: noPadding ? 0 : 10,
        backgroundColor: "#e5e5e5",
      }}
    >
      {imgLoading && (
        <ActivityIndicator
          size="large"
          color="#34A853"
          style={{
            position: "absolute",
            top: "45%",
            left: "45%",
            zIndex: 100,
          }}
        />
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%", height }}
      >
        {images?.map((img, index) => {
          const src =
            typeof img.source === "string" ? { uri: img.source } : img.source;

          return (
            <View key={index} style={{ width: carouselWidth, height }}>
              <Animated.View
                style={[
                  { width: "100%", height: "100%" },
                  fadeStyle,
                ]}
              >
                <Image
                  source={src}
                  style={{ width: "100%", height: "100%" }}
                  contentFit={img.fit || "cover"}
                  onLoadStart={() => {
                    setImgLoading(true);
                    fadeIn.value = 0;
                  }}
                  onLoadEnd={() => {
                    setImgLoading(false);
                    fadeIn.value = withTiming(1, { duration: 300 });
                  }}
                />
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ImageCarousel;
