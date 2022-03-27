import { getSingularDataType } from "./getSingularDataType";
export const getAllDataTypes = async () => {
  // Sets all 3 data types
  let returnObj = {};
  await Promise.all([
    getSingularDataType("confirmed"),
    getSingularDataType("deaths"),
    getSingularDataType("recovered"),
  ]).then((dataTypes) => {
    for (let i = 0; i < dataTypes.length; i++) {
      returnObj = { ...returnObj, ...dataTypes[i] };
    }
  });
  return returnObj;
};
