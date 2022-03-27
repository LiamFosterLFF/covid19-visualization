export const calculateDailyIncrease = (data) => {
  const dailyIncrease = [];
  if (data.length > 0) {
    // Calculates the change between totals each day
    // First one starts from 0 so just push the total
    dailyIncrease.push({
      date: data[0].date,
      increase: Number.parseInt(data[0].total),
    });
    for (let i = 1; i < data.length; i++) {
      const increase =
        Number.parseInt(data[i].total) - Number.parseInt(data[i - 1].total);
      if (increase > 0) {
        dailyIncrease.push({ date: data[i].date, increase: increase });
      }
    }
  }
  return dailyIncrease;
};
