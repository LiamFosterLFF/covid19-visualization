export const calculateMapStats = (countryData) => {
  const provinceStats = {};
  Object.entries(countryData).forEach(([provinceName, provinceData]) => {
    if (provinceData.confirmed && provinceData.confirmed.length > 0) {
      const mostRecentTotal = provinceData.confirmed.slice(-1)[0][1];
      const tenDaysAgoTotal = provinceData.confirmed.slice(-10)[0][1];
      const numberOfNewInfections = mostRecentTotal - tenDaysAgoTotal;
      // Prevent divide by 0
      const rateOfChange =
        mostRecentTotal === "0" ? 0 : numberOfNewInfections / mostRecentTotal;
      // Different threshold depending on if provincial or national sum
      const maxRedValue = 20000;
      provinceStats[provinceName.toLowerCase()] = {
        mostRecentTotal,
        tenDaysAgoTotal,
        tenDaysNewInfections: numberOfNewInfections,
        rateOfChange,
        tooltipMapStat: rateOfChange * numberOfNewInfections,
        mapColorStat:
          (rateOfChange * numberOfNewInfections) / (maxRedValue / 100),
      };
    }
  });
  return provinceStats;
};
