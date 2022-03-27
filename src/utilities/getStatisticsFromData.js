export const getStatisticsFromData = (data) => {
  const stats = { confirmed: 0, recovered: 0, deaths: 0 };
  // Find the most recent value for each province and add to totals for relevant dataset type
  Object.entries(data).forEach(([, provinceData]) => {
    Object.entries(provinceData).forEach(([dataType, dataSet]) => {
      // dataSet is of form [[date, total(str)]], so take last total of each and add it
      stats[dataType] += Number.parseInt(dataSet.slice(-1)[0][1]);
    });
  });
  return stats;
};
