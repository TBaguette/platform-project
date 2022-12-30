import {useEffect, useRef, useState} from "react";
import {BaseType} from "d3";
import * as d3 from "d3";
import InputLinearComponent from "../input/InputLinearDiagram";

const LinearComponent = () => {
    const refChart = useRef(null);
    const [data, setData] = useState([]);
    const [type, setType] = useState('appartement');

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/sales/price-evolution/' + type);
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, [refChart, type]);

    useEffect(() => {
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };

        LinearChartSVG(refChart.current, data, margin, {
            width: 500 - margin.left - margin.right,
            height: 500 - margin.top - margin.bottom
        });
    }, [data]);

    return (<div className="chart" ref={refChart}>
        <InputLinearComponent setType={setType}/>
    </div>)
}

const LinearChartSVG = (element: BaseType, data: { label: string, price: number }[], margin: {top: number, right: number, bottom: number, left: number}, options : {
  width: number,
  height: number
}) => {
    if(data.length < 2) return;

    d3.select(element)
        .select('svg')
        .remove();

    const svg = d3.select(element)
        .append('svg')
        .attr('width', options.width + margin.left + margin.right)
        .attr('height', options.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", options.width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-family", "Roboto Slab")
        .text("Prix moyen du mètre carré");

    let x = d3.scaleTime()
        .domain([
            new Date(data[0].label.split("/")[1], parseInt(data[0].label.split("/")[0])-1),
            new Date(data[data.length-1].label.split("/")[1], parseInt(data[data.length-1].label.split("/")[0])-1)
        ])
        .range([0, options.width]);

    let y = d3.scaleLinear()
        .domain([Math.min(...data.map(item => item.value))-10, Math.max(...data.map(item => item.value))+10])
        .range([options.height, 0]);

    let xAxisGroup = svg.append("g")
        .attr("transform", "translate(0," + (options.height) + ")");

    let yAxisGroup = svg.append("g")
        .attr("transform", "translate(0,0)");

    xAxisGroup.append("text")
        .attr("x", options.width / 2)
        .attr("y", margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Année");
    
    yAxisGroup.append("text")
        .attr("x", -options.height / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Prix");

    let xAxis = d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat("%m/%Y"))
        .tickSize(0);

    let yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickSize(0);

    xAxisGroup.call(xAxis);

    yAxisGroup.call(yAxis);

    let points = svg.selectAll(".point")
        .data(data)
        .enter(); 

    points.append("circle")
        .attr("cx", (d) => x(new Date(d.label.split('/')[1], parseInt(d.label.split('/')[0])-1)))
        .attr("cy", (d) => y(d.value))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("class", "point");

    let line = d3.line()
        .x(function(d) { return x(new Date(d.label.split('/')[1], parseInt(d.label.split('/')[0])-1)); })
        .y(function(d) { return y(d.value); })

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
};

export default LinearComponent;
