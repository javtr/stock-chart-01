import React,{useState} from "react";
import Chart from "../pure/Chart";
import * as d3 from "d3";

export default function MainChart() {
  const gMargin = 20;
  const gHeigth = 300;
  

  const tempData = [];
  for (let i = 1; i < 30; i++) {
    const obj = {
      Id: 1,
      Type: i,
      Count: 1 + i,
    };
    tempData.push(obj);
  }


  return (
    <div className="main">
      <Chart
        tempData={tempData}
        gMargin={gMargin}
        gHeigth={gHeigth}
      ></Chart>
    </div>
  );
}
