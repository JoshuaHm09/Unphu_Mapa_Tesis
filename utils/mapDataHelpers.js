import { supabase } from "../utils/supabase";
import { UI_ICONS } from "../src/uiIcons";

export const toPublicImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const { data } = supabase.storage.from("images").getPublicUrl(trimmed);
  return data?.publicUrl || "";
};

export const normalizeImagesField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((img) => {
        if (typeof img === "string") return toPublicImageUrl(img);

        if (img && typeof img === "object") {
          return toPublicImageUrl(img.url || img.src || "");
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed
          .map((img) => {
            if (typeof img === "string") return toPublicImageUrl(img);

            if (img && typeof img === "object") {
              return toPublicImageUrl(img.url || img.src || "");
            }

            return "";
          })
          .filter(Boolean);
      }
    } catch (error) {
      return [toPublicImageUrl(trimmed)].filter(Boolean);
    }

    return [toPublicImageUrl(trimmed)].filter(Boolean);
  }

  return [];
};

export const normalizeMenuField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          price: "",
        };
      }

      if (item && typeof item === "object") {
        return {
          ...item,
          name: item.name || item.item || item.title || "Sin nombre",
          price: item.price != null ? String(item.price) : "",
        };
      }

      return {
        name: "Sin nombre",
        price: "",
      };
    });
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") {
            return {
              name: item,
              price: "",
            };
          }

          if (item && typeof item === "object") {
            return {
              ...item,
              name: item.name || item.item || item.title || "Sin nombre",
              price: item.price != null ? String(item.price) : "",
            };
          }

          return {
            name: "Sin nombre",
            price: "",
          };
        });
      }
    } catch (error) {
      return trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          name: line,
          price: "",
        }));
    }
  }

  return [];
};

export const normalizeVendorsField = (value) => {
  if (!value) return {};

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  const normalized = {};

  Object.entries(parsed).forEach(([vendorName, vendorData]) => {
    normalized[vendorName] = {
      ...vendorData,
      schedule: vendorData?.schedule || "",
      menu: normalizeMenuField(vendorData?.menu),
      images: normalizeImagesField(vendorData?.images),
    };
  });

  return normalized;
};

export const normalizeFoodPlace = (item) => {
  return {
    ...item,
    images: normalizeImagesField(item?.images),
    menu: normalizeMenuField(item?.menu),
    vendors: normalizeVendorsField(item?.vendors),
  };
};

export const getMarkerForBuilding = (b) => {
  const id = b.id;
  let label = String(id);
  let iconSource = null;

  if (id === 16 || id === 23) {
    label = null;
    iconSource = UI_ICONS.ICON_SOCCER_2;
  } else if (id === 21) {
    label = null;
    iconSource = UI_ICONS.ICON_TENNIS_2;
  } else if (id === 20) {
    label = null;
    iconSource = UI_ICONS.ICON_BASKET_2;
  } else if (id === 22) {
    label = null;
    iconSource = UI_ICONS.ICON_GYM_2;
  } else if (id === 17) {
    label = null;
    iconSource = UI_ICONS.ICON_TREE_2;
  } else if (id === 15) {
    label = null;
    iconSource = UI_ICONS.ICON_BASEBALL_2;
  } else if (id === 12) {
    label = "6A";
  } else if (id === 13) {
    label = "12";
  } else if (id === 19) {
    label = "B";
  }

  return { label, iconSource };
};