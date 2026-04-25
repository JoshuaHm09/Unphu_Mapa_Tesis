export const asObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
};

export const normalizeImagesArray = (images) => {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images
      .map((img) => {
        if (typeof img === "string") return img.trim();

        if (img && typeof img === "object") {
          return (img.url || img.src || "").trim();
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof images === "string") {
    const trimmed = images.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed
          .map((img) => {
            if (typeof img === "string") return img.trim();

            if (img && typeof img === "object") {
              return (img.url || img.src || "").trim();
            }

            return "";
          })
          .filter(Boolean);
      }
    } catch (error) {

    }

    return [trimmed];
  }

  return [];
};

export const getFirstValidImage = (images) => {
  if (!images) return "";

  if (Array.isArray(images)) {
    for (const img of images) {
      if (typeof img === "string" && img.trim()) return img.trim();

      if (img && typeof img === "object") {
        const url = (img.url || img.src || "").trim();
        if (url) return url;
      }
    }
  }

  if (typeof images === "string") {
    const normalized = normalizeImagesArray(images);
    return normalized[0] || "";
  }

  return "";
};

export const normalizeVendorObject = (vendorsObject) => {
  const safeObject = asObject(vendorsObject);

  return Object.entries(safeObject).map(([vendorName, vendorData], index) => ({
    id: vendorData?.id || `vendor_${index}_${Date.now()}`,
    originalKey: vendorName,
    name: vendorName || "",
    schedule: vendorData?.schedule || "",
    menu: Array.isArray(vendorData?.menu)
      ? vendorData.menu.map((item, i) => ({
          id: item?.id || `menu_${index}_${i}_${Date.now()}`,
          name: item?.name || item?.item || item?.title || "",
          price:
            item?.price != null
              ? String(item.price).replace(/^RD\$\s*/i, "RD$")
              : "",
        }))
      : [],
    images: normalizeImagesArray(vendorData?.images).map((img, i) => ({
      id: `img_${index}_${i}_${Date.now()}`,
      url: img,
    })),
  }));
};

export const cleanMenu = (items) =>
  items
    .map((item) => ({
      name: (item.name || "").trim(),
      price: (item.price || "").trim(),
    }))
    .filter((item) => item.name || item.price);

export const cleanImages = (items) =>
  items
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") return (item.url || item.src || "").trim();
      return "";
    })
    .filter(Boolean);

export const buildVendorsObjectForSave = (vendorsArray) => {
  const result = {};

  vendorsArray.forEach((vendor) => {
    const cleanName = (vendor.name || "").trim();
    if (!cleanName) return;

    result[cleanName] = {
      schedule: (vendor.schedule || "").trim(),
      menu: cleanMenu(vendor.menu || []),
      images: cleanImages(vendor.images || []),
    };
  });

  return result;
};