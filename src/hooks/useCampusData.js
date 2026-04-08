import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../utils/supabase";
import { normalizeFoodPlace } from "../../utils/mapDataHelpers";

export default function useCampusData() {
  const [buildings, setBuildings] = useState([]);
  const [foodPlaza, setFoodPlaza] = useState([]);

  const fetchBuildings = useCallback(async () => {
    const { data, error } = await supabase
      .from("buildings")
      .select("id, name, subtitle, x, y, radius, images, floors, events");

    console.log("FETCH buildings data:", data);
    console.log("FETCH buildings error:", error);

    if (error) {
      console.log("Error loading buildings:", error.message);
      return;
    }

    if (data) {
      setBuildings(
        data.map((b) => ({
          ...b,
          images: b.images || [],
          floors: b.floors || {},
          events: b.events || [],
        }))
      );
    }
  }, []);

  const fetchFoodPlaces = useCallback(async () => {
    const { data, error } = await supabase.from("food_places").select("*");

    console.log("FETCH food_places data:", data);
    console.log("FETCH food_places error:", error);

    if (error) {
      console.log("Error loading food places:", error.message);
      return;
    }

    if (data) {
      const normalizedFoodPlaces = data.map(normalizeFoodPlace);

      console.log(
        "FETCH normalized food places:",
        JSON.stringify(normalizedFoodPlaces, null, 2)
      );

      setFoodPlaza(normalizedFoodPlaces);
    }
  }, []);

  useEffect(() => {
    fetchBuildings();
    fetchFoodPlaces();
  }, [fetchBuildings, fetchFoodPlaces]);

  return {
    buildings,
    foodPlaza,
    fetchBuildings,
    fetchFoodPlaces,
  };
}