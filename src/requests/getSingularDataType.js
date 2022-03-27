import * as d3 from "d3";

export const getSingularDataType = async (dataType) => {
  // Sets one data type at a time, saves on copy/paste

  const isSameDate = (dateObj1, dateObj2) =>
    dateObj1.getDate() === dateObj2.getDate() &&
    dateObj1.getMonth() === dateObj2.getMonth() &&
    dateObj1.getFullYear() === dateObj2.getFullYear();

  const cache = await caches.open("data.json");
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${dataType}_global.csv`;
  const cachedData = await cache.match(url);
  const dataDate = new Date(localStorage.getItem("dataDate"));
  if (cachedData === undefined || !isSameDate(new Date(), new Date(dataDate))) {
    const response = await fetch(url);
    const csvString = await response.text();
    const rawData = await d3.csvParse(csvString);
    cache.put(url, new Response(JSON.stringify(rawData)));
    localStorage.setItem("dataDate", new Date());
    return { [dataType]: rawData };
  } else {
    const rawData = await cachedData.json();
    return { [dataType]: rawData };
  }
};
