import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Chart = () => {
  const chartRef = useRef(null);

  const x = d3
  .scaleLinear()  

  const y = d3
  .scaleLinear()

  useEffect(() => {
    const width = 800;
    const height = 500;

    // Define the data
    const data = Array.from({ length: 100 }, () => [
      100 * Math.random(),
      Math.random(),
    ]);

    // Create the scales
    x 
     .domain(d3.extent(data, (d) => d[0]))
      .range([30, width - 10])
      .nice();

    y
      .domain(d3.extent(data, (d) => d[1]))
      .range([height - 20, 10])
      .nice();

    // Create the chart
    const svg = d3.select(chartRef.current).attr("viewBox", [0, 0, width, height]);

    svg
      .append("path")
      .attr(
        "d",
        d3.Delaunay.from(data.map((d) => [x(d[0]), y(d[1])]))
        .voronoi([35, 0, width, height - 25])
        .render()
      )
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);

    svg
      .selectAll("ellipse")
      .data(data)
      .join("ellipse")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("rx", 6 * Math.sqrt((width * height) / (800 * 500)))
      .attr("ry", 6 * Math.sqrt((width * height) / (800 * 500)))
      .attr("fill", () => d3.schemeOranges[9][Math.floor(Math.random() * 9)]);

    const dragX = d3
      .drag()
      .on("drag", (event) => {
        const dx = event.dx;
        const newXScale = x.copy().range([x.range()[0] + dx, x.range()[1] + dx]);
        svg.select(".xAxis").call(xAxis, newXScale);
        svg
          .selectAll("ellipse")
          .attr("cx", (d) => newXScale(d[0]));
      });

    const dragY = d3
      .drag()
      .on("drag", (event) => {
        const dy = event.dy;
        const newYScale = y.copy().range([y.range()[0] + dy, y.range()[1] + dy]);
        svg.select(".yAxis").call(yAxis, newYScale);
        svg
          .selectAll("ellipse")
          .attr("cy", (d) => newYScale(d[1]));
      });

    svg.append("g").call(xAxis, x).call(dragX);
    svg.append("g").call(yAxis, y).call(dragY);
  }, []);

  const xAxis = (g, scale) =>
    g
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(scale).ticks(12))
      .call((g) => g.select(".domain").attr("display", "none"));

  const yAxis = (g, scale) =>
    g
      .attr("class", "yAxis")
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(scale).ticks(12))
      .call((g) => g.select(".domain").attr("display", "none"));

  return <svg ref={chartRef}></svg>;
};

export default Chart;
