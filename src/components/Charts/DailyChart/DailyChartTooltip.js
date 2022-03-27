import React from "react";

const DailyChartTooltip = ({ active, payload, label }) => {
  const formatValue = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const capitalize = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ textAlign: "center", background: "rgba(255, 255, 255, 0.75)" }}
      >
        <div className="label">{`${label} (${capitalize("dataType")})`}</div>
        {payload.map((dataPoint, index) => {
          const valueType = capitalize(dataPoint.name);
          return (
            <div className={valueType} key={index}>
              {" "}
              {`${valueType}: ${formatValue(dataPoint.value)}`}{" "}
            </div>
          );
        })}
        <div className="desc1">Click to set date back to {label}.</div>
      </div>
    );
  }

  return null;
};

export default DailyChartTooltip;
