import { capitalize } from "./capitalize";

export const formatCountryNameCamelCase = (countryName) => {
  return countryName
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLocaleLowerCase();
      }
      return capitalize(word);
    })
    .join("");
};
