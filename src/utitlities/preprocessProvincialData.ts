const preprocessProvincialData = (countryData) => {
  // Three countries (aus, can, china) are special cases that do not have nationwide statistics - create these
  const specialCaseCountries = ["Australia", "China", "Canada"];
  specialCaseCountries.forEach((country) => {
    const nationwideData = { confirmed: [], recovered: [], deaths: [] };
    // Find all the provinces for that country
    Object.entries(countryData).forEach(([provinceName, provinceData]) => {
      if (provinceName.split(",")[0] === country) {
        // Cycle through datasets and combine them
        Object.entries(provinceData).forEach(([dataType, dataSet]) => {
          for (let i = 0; i < dataSet.length; i++) {
            // Push in item from dataset if no point yet exists, else add totals together
            const dataPoint = nationwideData[dataType][i];
            if (dataPoint) {
              const newTotal =
                Number.parseInt(nationwideData[dataType][i][1]) +
                Number.parseInt(dataSet[i][1]);
              nationwideData[dataType][i][1] = newTotal;
            } else {
              nationwideData[dataType].push(dataSet[i]);
            }
          }
        });
      }
    });
    countryData[country] = nationwideData;
  });
  return countryData;
};

export default preprocessProvincialData;
