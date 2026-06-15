import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useFavorites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [removedHistory, setRemovedHistory] = useState([]);

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
      setFavoritesList((prev) => {
        const isFav = prev.some((b) => b.id === building.id);

        if (isFav) {
          setRemovedHistory((history) => [...history, building]);
          showToast("Edificio eliminado de favoritos");

          return prev.filter((b) => b.id !== building.id);
        }

        showToast("Edificio agregado a favoritos");

        return [...prev, building];
      });
    },
    [showToast]
  );

  const undoLastRemoved = useCallback(() => {
    setRemovedHistory((history) => {
      if (history.length === 0) return history;

      setFavoritesList((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));

        const restoredItems = history.filter(
          (b) => !existingIds.has(b.id)
        );

        return [...prev, ...restoredItems];
      });

      showToast("Favoritos restaurados");

      return [];
    });
  }, [showToast]);

  return {
    favoritesList,
    removedHistory,
    toastMessage,
    toastVisible,
    toggleFavorite,
    undoLastRemoved,
  };
}