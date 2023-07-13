import React, { useState } from "react";
import Chart from "../pure/Chart";
import * as d3 from "d3";

export default function MainChart() {
  const gMargin = 20;
  const gHeigth = 300;

  const tempData = [];
  


  let prevYmax = null;

  for (let i = 1; i < 30; i++) {
    let ymin, ymax;
  
    if (prevYmax !== null) {
      ymin = Math.max(0, prevYmax - 4);
      const maxDifference = Math.min(10, 100 - ymin - 4);
      ymax = ymin + Math.floor(Math.random() * maxDifference) + 4;
    } else {
      ymin = Math.floor(Math.random() * 88);
      const maxDifference = Math.min(10, 100 - ymin - 4);
      ymax = ymin + Math.floor(Math.random() * maxDifference) + 4;
    }
  
    prevYmax = ymax;
  
    const obj = {
      Id: 1,
      Type: i,
      Count: 1 + i,
      ymin: ymin,
      ymax: ymax,
    };
    tempData.push(obj);
  }
  
  
  

  return (
    <div className="main">
      <Chart tempData={tempData} gMargin={gMargin} gHeigth={gHeigth}></Chart>
    </div>
  );
}
