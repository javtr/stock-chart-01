import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Chart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    const data = [
      { x: 20, yMin: 50, yMax: 80 },
      { x: 50, yMin: 30, yMax: 40 },
    ];

    const svg = d3.select(chartRef.current);

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.x))
      .attr('y', (d) => yScale(d.yMax))
      .attr('width', 20)
      .attr('height', (d) => yScale(d.yMin) - yScale(d.yMax))
      .attr('fill', 'steelblue');
  };

  return (
    <svg ref={chartRef} width={400} height={300}>
      <g></g>
    </svg>
  );
};

export default Chart;
