import { csv } from "d3";

const getUSData = async () => {
  const rawData = await csv(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv`
  );
  return rawData;
};

export default getUSData;
