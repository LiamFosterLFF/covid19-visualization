import React from "react";

const TotalChartTooltip = ({ active, payload, label }) => {
  const formatValue = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ textAlign: "center", background: "rgba(255, 255, 255, 0.75)" }}
      >
        <div className="label">{`${label}`}</div>
        {payload.map((dataPoint, index) => {
          const dataType =
            dataPoint.name[0].toUpperCase() + dataPoint.name.slice(1);
          return (
            <div className={dataType} key={index}>
              {" "}
              {`${dataType}: ${formatValue(dataPoint.value)}`}{" "}
            </div>
          );
        })}
        <div className="desc">Click to set date back to {label}.</div>
      </div>
    );
  }

  return null;
};

export default TotalChartTooltip;
