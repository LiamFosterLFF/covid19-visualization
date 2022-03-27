const capitalizeCountry = (country) =>
  country
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
