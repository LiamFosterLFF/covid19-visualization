export const getLineData = (data) => {
  const ld = [];
  for (let i = 0; i < data["confirmed"].length; i++) {
    ld.push({
      date: data["confirmed"][i].date,
      confirmed: data["confirmed"][i].total,
      recovered: data["recovered"][i].total,
      deaths: data["deaths"][i].total,
    });
  }
  return ld;
};
