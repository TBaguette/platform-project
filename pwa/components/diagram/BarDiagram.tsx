import * as d3 from "d3";
import { BaseType } from "d3";
import { useEffect, useRef } from "react";
import InputBarComponent from "../input/InputBarDiagram";

const BarComponent = () => {
  const refChart = useRef(null);

  useEffect(() => {

    const data = [
      { date: '2022-01', sales: 100 },
      { date: '2022-02', sales: 200 },
      { date: '2022-03', sales: 300 },
      { date: '2022-04', sales: 400 },
      { date: '2022-05', sales: 500 },
      { date: '2022-06', sales: 600 },
      { date: '2022-07', sales: 700 },
      { date: '2022-08', sales: 800 },
      { date: '2022-09', sales: 900 },
      { date: '2022-10', sales: 1000 }
    ];

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    BarChartSVG(refChart.current, data, margin, {
      width: 500,
      height: 500
    });
  }, [refChart]);

  return (<div className="chart" ref={refChart}>
    <InputBarComponent/>
  </div>);
}

const BarChartSVG = (element: BaseType, data: { date: string, sales: number }[], margin: {top: number, right: number, bottom: number, left:number},  options : {
  width: number,
  height: number
}) => {

  d3
    .select(element)
    .select('svg')
    .remove();

  const svg = d3
    .select(element)
    .append('svg')
    .attr('width', options.width)
    .attr('height', options.height)
    .append('g');

  svg.append("text")
    .attr("x", options.width / 2 + 50)
    .attr("y", 50)
    .attr("font-size", "20px")
    .attr("font-family", "Roboto Slab")
    .attr("text-anchor", "middle")
    .text("Nombre de ventes sur un interval donnée");


  let xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.date; }))
    .range([0, 500])
    .padding(0.2);

  let yScale = d3.scaleLinear()
    .domain([d3.max(data, function(d) { return d.sales; }), 0])
    .range([0, 300]);

  let xAxisGroup = svg.append("g")
    .attr("transform", "translate(100," + (options.height-100) + ")");

  let yAxisGroup = svg.append("g")
    .attr("transform", "translate(100," + 100 + ")");

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup.selectAll("line")
    .style("stroke", "black");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return (xScale(d.date)+100); })
    .attr("y", function(d) { return options.height-100 - yScale(d.sales); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return yScale(d.sales); })
    .attr("fill", "teal");

  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d.sales; })
    .attr("x", function(d) { return xScale(d.date) + xScale.bandwidth() / 2; })
    .attr("y", function(d) { return options.height - yScale(d.sales) + 15; })
    .attr("font-size", "14px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");
};


export default BarComponent;
