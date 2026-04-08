import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useFavorites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      const raw = await AsyncStorage.getItem("favoritesList");
      if (raw) setFavoritesList(JSON.parse(raw));
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }, [favoritesList]);

  const toggleFavorite = useCallback(
    (building) => {
      const isFav = favoritesList.some((b) => b.id === building.id);

      if (isFav) {
        setFavoritesList((prev) => prev.filter((b) => b.id !== building.id));
        setLastRemoved(building);
        showToast("Edificio eliminado de favoritos");
      } else {
        setFavoritesList((prev) => [...prev, building]);
        setLastRemoved(null);
        showToast("Edificio agregado a favoritos");
      }
    },
    [favoritesList, showToast]
  );

  const undoLastRemoved = useCallback(() => {
    if (lastRemoved) {
      setFavoritesList((prev) => [...prev, lastRemoved]);
      setLastRemoved(null);
    }
  }, [lastRemoved]);

  return {
    favoritesList,
    lastRemoved,
    toastMessage,
    toastVisible,
    toggleFavorite,
    undoLastRemoved,
  };
}