export const createCountryTimeSeries = (countryData) => {
  const createSortedTimeSeriesArray = (dataTypeProvinceData) => {
    // Takes time series object for chosen country and turns into sorted array of form [[date, value],]
    return dataTypeProvinceData.sort((a, b) => {
      // Split date strings into segments, then sort by Y, M, D (US format dates)
      const [aArr, bArr] = [a[0].split("/"), b[0].split("/")];
      const checkingOrder = [2, 0, 1];
      for (let i = 0; i < checkingOrder.length; i++) {
        const c = checkingOrder[i];
        const [aVal, bVal] = [
          Number.parseInt(aArr[c]),
          Number.parseInt(bArr[c]),
        ];
        if (aVal > bVal) {
          return 1;
        } else if (bVal > aVal) {
          return -1;
        }
      }
      return 0;
    });
  };

  // Go through each of the provinces and create a separate entry for each; if none, will just do country as a whole
  const sortedTimeSeriesArrays = {};
  Object.entries(countryData).forEach(([dataType, provinces]) => {
    provinces.forEach((province) => {
      const subprovinceName =
        province["Province/State"] === ""
          ? ""
          : `, ${province["Province/State"]}`;
      // Handle US slightly differently, easier to deal with
      const provinceName =
        province["Country/Region"] === "US"
          ? "United States"
          : province["Country/Region"];
      const provinceText = provinceName + subprovinceName;
      const provinceData = Object.entries(province).filter(
        ([key, value]) => !isNaN(key[0])
      );
      // Create province name in time series array if not already created
      sortedTimeSeriesArrays[provinceText] = sortedTimeSeriesArrays[
        provinceText
      ]
        ? { ...sortedTimeSeriesArrays[provinceText] }
        : {};
      sortedTimeSeriesArrays[provinceText][dataType] =
        createSortedTimeSeriesArray(provinceData);
    });
  });
  return sortedTimeSeriesArrays;
};
