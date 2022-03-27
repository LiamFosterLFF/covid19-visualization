const getFormattedDate = () => {
  const presentDateObj = new Date();
  const day = presentDateObj.getDate();
  const month = presentDateObj.getMonth() + 1;
  const year = presentDateObj.getFullYear().toString().slice(2);
  return `${month}/${day}/${year}`;
};

export default getFormattedDate;
