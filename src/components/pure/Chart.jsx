import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Chart = ({ tempData }) => {
  const verticalSVGRef = useRef(null);
  const horizontalSVGRef = useRef(null);
  const barsSVGRef = useRef(null); // Referencia al elemento SVG para las barras

  useEffect(() => {
    if (tempData && horizontalSVGRef.current && barsSVGRef.current) {
      createBarChart();
    }
  }, [tempData]);

  const createBarChart = () => {
    const verticalChartContainer = d3.select(verticalSVGRef.current);
    const horizontalChartContainer = d3.select(horizontalSVGRef.current);
    const barsContainer = d3.select(barsSVGRef.current); // Contenedor de las barras
    const barWidth = 30;
    const paddingFactor = 2.2;
    const padding = 20;
    const responsiveDIVHeight = 300;
    const responsiveDIVWidth = tempData.length * barWidth * paddingFactor;

    verticalChartContainer.selectAll("*").remove();
    horizontalChartContainer.selectAll("*").remove();
    barsContainer.selectAll("*").remove(); // Limpia el contenedor de las barras

    // Ejes
    const x = d3
      .scaleBand()
      .rangeRound([0, responsiveDIVWidth])
      .padding(0.5)
      .domain(tempData.map((d) => d.Type));

    const y = d3
      .scaleLinear()
      .rangeRound([responsiveDIVHeight - padding, padding])
      .domain([0, d3.max(tempData, (d) => d.Count + 10)]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Elemento SVG para el eje X
    const svgX = horizontalChartContainer
      .append("svg")
      .attr("width", responsiveDIVWidth)
      .attr("height", responsiveDIVHeight)
      .attr("transform", "translate(0, 0)");

    svgX
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${responsiveDIVHeight - padding})`)
      .call(xAxis)
      .selectAll("text")
      .attr("dx", "-0.8em")
      .attr("dy", "-.15em")
      .attr("transform", "rotate(-60)");

    svgX.call(d3.drag().on("drag", dragged));

    // Elemento SVG para las barras
    const svgBars = barsContainer
      .append("svg")
      .attr("width", responsiveDIVWidth)
      .attr("height", responsiveDIVHeight)
      .attr("transform", "translate(0, 0)")
      .attr("transform", "scale(1, 1)");

    //metodo zoom
    //   const zoom = d3.zoom()
    //   .on("zoom", zoomed);

    //   barsContainer.call(zoom)

    // function zoomed({transform}) {
    //     svgBars.attr("transform", transform);
    //     svgY.attr("transform", transform);

    //     console.log(transform);

    //   }

    svgBars
      .selectAll(".bar")
      .data(tempData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.Count))
      .attr("x", (d) => x(d.Type))
      .attr("width", barWidth)
      .attr("height", (d) => responsiveDIVHeight - y(d.Count) - padding);

    // svgBars.call(d3.drag().on("drag", draggedChart));

    // Elemento SVG para el eje Y
    const svgY = verticalChartContainer
      .append("svg")
      .attr("height", responsiveDIVHeight)
      .attr("width", 50);

    svgY
      .append("g")
      .attr("class", "yAxis")
      .call(yAxis)
      .attr("dx", "-0.3em")
      .attr("transform", "translate(50, 0)");

    svgY.call(d3.drag().on("drag", draggedY));

    //------------ metodos ----------------------------------

    //drag en chart

    function draggedChart(event) {
      const dx = event.dx;

      const currentTransform = parseFloat(
        svgBars.attr("transform").split("(")[1].split(",")[0]
      );

      const newTransform = currentTransform + dx;

      // Obtener el ancho del chart actual
      const chartContainer = d3.select(barsSVGRef.current);
      const containerWidth = chartContainer
        .node()
        .getBoundingClientRect().width;

      //   Restringir drag si se pasa de los límites del chart
      if (newTransform < 0 && Math.abs(newTransform) + 20 < containerWidth) {
        svgBars.attr("transform", `translate(${newTransform}, 0)`);
        svgX.attr("transform", `translate(${newTransform}, 0)`);
      }
    }

    // Drag en eje X

    function dragged(event) {
      const dx = event.dx;

      // Cuerpo del chart
      if (event.y < responsiveDIVHeight - padding) {
        // const currentTransform = parseFloat(
        //   svgX.attr("transform").split("(")[1].split(",")[0]
        // );
        // const newTransform = currentTransform + dx;
        // // Obtener el ancho del chart actual
        // const chartContainer = d3.select(horizontalSVGRef.current);
        // const containerWidth = chartContainer
        //   .node()
        //   .getBoundingClientRect().width;
        // // Restringir drag si se pasa de los límites del chart
        // if (
        //   newTransform < 0 &&
        //   Math.abs(newTransform) + containerWidth < responsiveDIVWidth
        // ) {
        //   svgX.attr("transform", `translate(${newTransform}, 0)`);
        // }
      } else {
        // Ancho de las barras
        // const currentRange = x.range();
        // const responsiveDIVWidth2 = currentRange[1] + dx;
        // x.rangeRound([0, responsiveDIVWidth2])
        //   .padding(0.5)
        //   .domain(tempData.map((d) => d.Type));
        // svgBars
        //   .selectAll(".bar")
        //   .data(tempData, (d) => d.Type)
        //   .attr("x", (d) => x(d.Type))
        //   .attr("width", x.bandwidth());
        // svgX.select(".x.axis").call(d3.axisBottom(x));
      }
    }

    // Drag en eje Y
    function draggedY(event) {
      const dy = event.dy;
      const currentDomain = y.domain();

      y.domain([currentDomain[0] + dy / 2, currentDomain[1] - dy / 2]);
      svgY.select(".yAxis").call(d3.axisLeft(y));

      svgBars
      .selectAll(".bar")
      .attr("y", (d) => y(d.Count))
      .attr("x", (d) => x(d.Type))
      .attr("width", barWidth)
      .attr("height", (d) =>  y(d.Count));
        

      //   const currentScaleY = parseFloat(
      //     svgBars.attr("transform").split("scale(1, ")[1].split(")")[0]
      //   );

      //   console.log(currentScaleY);

      //   svgBars.attr("transform", `scale(1, ${currentScaleY + (dy*0.01)})`);
    }
  };

  return (
    <div className="chart">
      <div id="yaxis" ref={verticalSVGRef} className="chart__yaxis"></div>
      <div ref={horizontalSVGRef} className="chart__xaxis"></div>
      <div ref={barsSVGRef} className="chart__bars"></div>
    </div>
  );
};

export default Chart;
