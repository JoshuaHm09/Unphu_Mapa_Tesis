export const routeNodes = {
  e2_entry: { id: "e2_entry", x: 2407.44, y: 3623.25 },

  e2_from_4_entry: {
    id: "e2_from_4_entry",
    x: 2519.92,
    y: 3470.09,
  },

  e1_entry: { id: "e1_entry", x: 2152.54, y: 3778.16 },

  path_1_2_1: { id: "path_1_2_1", x: 2223.59, y: 3738.09 },
  path_1_2_2: { id: "path_1_2_2", x: 2188.39, y: 3660.28 },
  path_1_2_3: { id: "path_1_2_3", x: 2256.55, y: 3619.04 },
  path_1_2_4: { id: "path_1_2_4", x: 2307.7, y: 3633.5 },

  path_2_4_1: { id: "path_2_4_1", x: 2537.09, y: 3356.59 },
  path_2_4_2: { id: "path_2_4_2", x: 2438.61, y: 3216.09 },
  path_2_4_3: { id: "path_2_4_3", x: 2443.11, y: 2826.01 },

  e4_entry: { id: "e4_entry", x: 2583.13, y: 2833.18 },

  e10_entry: { id: "e10_entry", x: 2716.71, y: 4823.75 },
  path_10_11_1: { id: "path_10_11_1", x: 2710.47, y: 4929.95 },
  e11_entry: { id: "e11_entry", x: 2406.72, y: 4925.76 },

  path_10_2_1: { id: "path_10_2_1", x: 2740.17, y: 4858.86 },
  path_10_2_2: { id: "path_10_2_2", x: 2903.07, y: 4847.16 },
  path_10_2_3: { id: "path_10_2_3", x: 2918.74, y: 3859.76 },
  path_10_2_4: { id: "path_10_2_4", x: 2264.88, y: 3776.9 },
  path_10_2_5: { id: "path_10_2_5", x: 2202.78, y: 3672.33 },
  path_10_2_6: { id: "path_10_2_6", x: 2276.58, y: 3631.37 },

  path_11_2_1: { id: "path_11_2_1", x: 2728.7, y: 4926.06 },
  path_11_2_2: { id: "path_11_2_2", x: 2734.37, y: 4845.22 },
  path_11_2_3: { id: "path_11_2_3", x: 2893.77, y: 4836.91 },
  path_11_2_4: { id: "path_11_2_4", x: 2922.29, y: 3852.73 },
  path_11_2_5: { id: "path_11_2_5", x: 2256.53, y: 3777.56 },
  path_11_2_6: { id: "path_11_2_6", x: 2191.94, y: 3665.56 },
  path_11_2_7: { id: "path_11_2_7", x: 2279.38, y: 3615.51 },


  path_2_6_1: { id: "path_2_6_1", x: 2214.74, y: 3591.32 },
  path_2_6_2: { id: "path_2_6_2", x: 2097.4, y: 3417.12 },
  path_2_6_3: { id: "path_2_6_3", x: 2099.48, y: 3374.16 },
  path_2_6_4: { id: "path_2_6_4", x: 2016.79, y: 3314.54 },
  path_2_6_5: { id: "path_2_6_5", x: 1980.49, y: 3269.35 },
  path_2_6_6: { id: "path_2_6_6", x: 1882.6, y: 3210.57 },
  path_2_6_7: { id: "path_2_6_7", x: 1871.12, y: 2823.1 },
  path_2_6_8: { id: "path_2_6_8", x: 1893.37, y: 2789.97 },
  path_2_6_9: { id: "path_2_6_9", x: 1878.85, y: 2688.56 },
  path_2_6_10: { id: "path_2_6_10", x: 1834.47, y: 2574.28 },
  path_2_6_11: { id: "path_2_6_11", x: 1840.85, y: 2272.83 },
  path_2_6_12: { id: "path_2_6_12", x: 1850.92, y: 2163.35 },
  path_2_6_13: { id: "path_2_6_13", x: 1855.14, y: 2059.37 },
  path_2_6_14: { id: "path_2_6_14", x: 1834.65, y: 1973.31 },
  path_2_6_15: { id: "path_2_6_15", x: 1802.21, y: 1929.87 },

  e6_entry: { id: "e6_entry", x: 1595.07, y: 1918.63 },
};

export const routeEdges = [
  ["e1_entry", "path_1_2_1"],
  ["path_1_2_1", "path_1_2_2"],
  ["path_1_2_2", "path_1_2_3"],
  ["path_1_2_3", "path_1_2_4"],
  ["path_1_2_4", "e2_entry"],

  // 2 -> 4
  ["e2_entry", "path_2_4_1"],
  ["path_2_4_1", "path_2_4_2"],
  ["path_2_4_2", "path_2_4_3"],
  ["path_2_4_3", "e4_entry"],

  // 4 -> 2
  ["e4_entry", "path_2_4_3"],
  ["path_2_4_3", "path_2_4_2"],
  ["path_2_4_2", "path_2_4_1"],
  ["path_2_4_1", "e2_from_4_entry"],

  ["e10_entry", "path_10_11_1"],
  ["path_10_11_1", "e11_entry"],

  ["e10_entry", "path_10_2_1"],
  ["path_10_2_1", "path_10_2_2"],
  ["path_10_2_2", "path_10_2_3"],
  ["path_10_2_3", "path_10_2_4"],
  ["path_10_2_4", "path_10_2_5"],
  ["path_10_2_5", "path_10_2_6"],
  ["path_10_2_6", "e2_entry"],

  ["e11_entry", "path_11_2_1"],
  ["path_11_2_1", "path_11_2_2"],
  ["path_11_2_2", "path_11_2_3"],
  ["path_11_2_3", "path_11_2_4"],
  ["path_11_2_4", "path_11_2_5"],
  ["path_11_2_5", "path_11_2_6"],
  ["path_11_2_6", "path_11_2_7"],
  ["path_11_2_7", "e2_entry"],

  ["e2_entry", "path_2_6_1"],
  ["path_2_6_1", "path_2_6_2"],
  ["path_2_6_2", "path_2_6_3"],
  ["path_2_6_3", "path_2_6_4"],
  ["path_2_6_4", "path_2_6_5"],
  ["path_2_6_5", "path_2_6_6"],
  ["path_2_6_6", "path_2_6_7"],
  ["path_2_6_7", "path_2_6_8"],
  ["path_2_6_8", "path_2_6_9"],
  ["path_2_6_9", "path_2_6_10"],
  ["path_2_6_10", "path_2_6_11"],
  ["path_2_6_11", "path_2_6_12"],
  ["path_2_6_12", "path_2_6_13"],
  ["path_2_6_13", "path_2_6_14"],
  ["path_2_6_14", "path_2_6_15"],
  ["path_2_6_15", "e6_entry"],
];

export const routePlaces = {
  1: "e1_entry",
  2: "e2_entry",
  4: "e4_entry",
  6: "e6_entry",
  10: "e10_entry",
  11: "e11_entry",
};

export const getRoutePlaceNode = (fromId, toId, placeId) => {
  const from = Number(fromId);
  const to = Number(toId);
  const current = Number(placeId);

  if (from === 2 && to === 4 && current === 2) {
    return "e2_from_4_entry";
  }

  if (from === 4 && to === 2 && current === 2) {
    return "e2_from_4_entry";
  }

  return routePlaces[current];
};