import { csv } from "d3";

export const getProcessedUSData = async () => {
  const getUSData = async () => {
    const rawData = await csv(
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv`
    );
    return rawData;
  };

  const processUSData = (USData) => {
    // Need to clean the data a little bit, the dictionary keys don't match
    const processedData = {};
    USData.forEach((localDataSet) => {
      const stateName = `united states, ${localDataSet["Province_State"]}`;
      const localData = Object.entries(localDataSet).filter(([key, entry]) => {
        return !isNaN(Number(key[0]));
      });
      if (processedData[stateName]) {
        localData.forEach((dataPoint, index) => {
          const newTotal =
            Number.parseInt(processedData[stateName].confirmed[index][1]) +
            Number.parseInt(dataPoint[1]);
          processedData[stateName].confirmed[index][1] = newTotal;
        });
      } else {
        processedData[stateName] = { confirmed: localData };
      }
    });
    return processedData;
  };
  let processedData;
  await getUSData().then((data) => {
    processedData = processUSData(data);
  });
  return processedData;
};
