import type { VehicleColor } from "../../types";

export const MULTICOLOR_COLORS = ["#E57373", "#FFB74D", "#81C784", "#64B5F6", "#9575CD", "#BA68C8"];
export const CAMOUFLAGE_COLORS = ["#557153", "#4a6448", "#a9af7e", "#7d8f69"];

const getBackgroundColor = (item: VehicleColor, isDark: boolean) => {
  switch (item.code) {
    case "MUL":
      return MULTICOLOR_COLORS;
    case "WHI":
    case "BGE":
    case "CRM":
      return !isDark && "rgba(0, 0, 0, 0.07)";
    case "CAM":
      return CAMOUFLAGE_COLORS;
    default: {
      const splitted = item.rgba?.split(",");
      splitted?.pop();
      return `${splitted?.join(",")}, 0.15)`;
    }
  }
};

const getItemColor = (item: VehicleColor) => {
  if (item.code === "MUL" || item.code === "CAM") return "white";
  return item.rgba;
};

export { getBackgroundColor, getItemColor };
