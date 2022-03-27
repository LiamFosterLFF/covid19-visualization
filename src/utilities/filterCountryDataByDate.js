export const filterCountryDataByDate = (countryData, dateLimit) => {
  const newCountryData = {};
  const dateLimitObj = new Date(dateLimit);
  Object.entries(countryData.original).forEach(
    ([provinceName, provinceData]) => {
      newCountryData[provinceName] = {};
      Object.entries(provinceData).forEach(([dataType, dataSet]) => {
        newCountryData[provinceName][dataType] = dataSet.filter(
          ([date]) => dateLimitObj >= new Date(date)
        );
      });
    }
  );
  return newCountryData;
};
