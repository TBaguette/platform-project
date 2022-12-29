import {useEffect, useRef} from "react";
import {BaseType} from "d3";
import * as d3 from "d3";

const LinearComponent = () => {

  const refChart = useRef(null);

  useEffect(() => {
    const data = [
      { year: "2017", price: 100 },
      { year: "2018", price: 110 },
      { year: "2019", price: 105 },
      { year: "2020", price: 115 },
      { year: "2021", price: 120 }
    ];

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    LinearChartSVG(refChart.current, data, margin, {
      width: 500,
      height: 500
    });
  }, [refChart]);

  return <div className="chart" ref={refChart}></div>
}

const LinearChartSVG = (element: BaseType, data: { year: string, price: number }[], margin: {top: number, right: number, bottom: number, left: number}, options : {
  width: number,
  height: number
}) => {

  // Créer un échelle pour l'axe X (les années)
  const x = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([margin.left, options.width - margin.right])
    .padding(0.1);

  // Créer un échelle pour l'axe Y (les prix)
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price)])
    .range([options.height - margin.bottom, margin.top]);

  // Créer un axe X
  const xAxis = g => g
    .attr("transform", `translate(0,${options.height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Créer un axe Y
  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y));

  // Créer un svg pour le diagramme
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", options.width)
    .attr("height", options.height);

  // Ajouter les données au svg
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.price))
    .attr("width", x.bandwidth())
    .attr("height", d => y(0) - y(d.price))
    .attr("fill", "steelblue");

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);
};

export default LinearComponent;
