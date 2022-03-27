export const getCountryData = (data, country) => {
  if (country === "world") {
    return data.rawData;
  } else {
    const countryData = {};
    Object.entries(data.rawData).forEach(([dataType, dataSet]) => {
      countryData[dataType] = dataSet.filter(
        (obj) => obj["Country/Region"].toLowerCase() === country
      );
    });
    return countryData;
  }
};
