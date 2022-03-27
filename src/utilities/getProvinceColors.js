import { invertDictionary } from "./invertDictionary";
import Rainbow from "rainbowvis.js";

export const getProvinceColors = ({
  currentCountry,
  mapStats,
  countryNameDictionary,
}) => {
  // Set a custom color gradient from 0=green to 100=red
  const rainbow = new Rainbow();
  rainbow.setSpectrum("#29e229", "#ddd623", "#e72a2a");
  const defaultColorCountries = [
    "world",
    "canada",
    "australia",
    "china",
    "united states",
  ];
  const defaultColor = defaultColorCountries.includes(currentCountry)
    ? "grey"
    : "#" + rainbow.colourAt(Math.floor(mapStats[currentCountry].mapColorStat));
  const countryIdDictionary = invertDictionary(countryNameDictionary);

  const newProvinceColors = Object.entries(mapStats).reduce(
    (colorString, [provinceName, provinceStat]) => {
      const provinceId = countryIdDictionary[provinceName.toLowerCase()];
      if (provinceId !== undefined) {
        // Object is in dictionary (not a boat or small country etc)
        const hue = rainbow.colourAt(Math.floor(provinceStat.mapColorStat));
        colorString += `&[id="${provinceId}"] {fill: #${hue}}`;
      }
      return colorString;
    },
    ""
  );

  return {
    default: defaultColor,
    provinces: newProvinceColors,
  };
};
