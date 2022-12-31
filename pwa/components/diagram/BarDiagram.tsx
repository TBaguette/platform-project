import * as d3 from "d3";
import { BaseType } from "d3";
import { useEffect, useRef, useState } from "react";
import InputBarComponent from "../input/InputBarDiagram";

const BarComponent = () => {
    const refChart = useRef(null);
    const [data, setData] = useState([]);
    const [type, setType] = useState("month");
    const [dateStart, setDateStart] = useState("2017-01-01");
    const [dateEnd, setDateEnd] = useState("2017-12-31");

    useEffect(() => {
        if(refChart.current !== null)
            refChart.current.classList.add('loading');

        async function fetchData() {
            console.log('/sales/countby/' + type + '/' + dateStart + '/' + dateEnd)
            const res = await fetch('/sales/countby/' + type + '/' + dateStart + '/' + dateEnd);
            const data = await res.json();
            setData(data);
            if(refChart.current !== null)
                refChart.current.classList.remove('loading');
        }
        fetchData();
    }, [refChart, type, dateStart, dateEnd]);

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };

        BarChartSVG(refChart.current, data, type, margin, {
            width: 500,
            height: 500
        });
    }, [data]);

    return (<div className={"chart" + (data.length !== 0 ? "" : " loading")} ref={refChart}>
        <InputBarComponent type={type} setType={setType} dateStart={dateStart} setDateStart={setDateStart} dateEnd={dateEnd} setDateEnd={setDateEnd}/>
    </div>);
}

const BarChartSVG = (element: BaseType, data: { label: string, value: number }[], type: string, margin: {top: number, right: number, bottom: number, left:number},  options : {
    width: number,
    height: number
}) => {

    d3.select(element)
        .select('svg')
        .remove();

    const svg = d3.select(element)
        .append('svg')
        .attr('width', options.width + margin.left + margin.right)
        .attr('height', options.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    let x = d3.scaleBand()
        .domain(data.map(function(d) { return d.label; }))
        .range([0, options.width - 10])
        .padding(0.1);

    let y = d3.scaleLinear()
        .domain([Math.min(...data.map(item => item.value))-10, Math.max(...data.map(item => item.value))+10])
        .range([options.height - 10, 0]);

    let xAxisGroup = svg.append("g")
        .attr("transform", "translate(10," + (options.height - 10) + ")");

    let yAxisGroup = svg.append("g")
        .attr("transform", "translate(10,0)");

    let xAxis = d3.axisBottom(x)
        .tickFormat(function(d, i) {
            if (data.length < 20 || i % (Math.floor(data.length / 10)) === 0) {
                return d;
            }
            return "";
        })
        .tickSize(5);

    let yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickSize(5);

    xAxisGroup.call(xAxis)
        .selectAll("text")
        .attr("transform", (type !== 'year') ? "rotate(45) translate(30,0)" : "");

    yAxisGroup.call(yAxis);

    const tooltip = d3.select(element)
        .append("div")
        .style("display", "none")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("color", "#38a9b4")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("border-color", "#38a9b4")
        .style("padding", "5px");

    let legend = svg.append("g");

    let legendType = 'Mois';
    switch (type) {
        case 'year':
            legendType = 'Année';
            break;
        case 'day':
            legendType = 'Jour';
            break;
        case 'week':
            legendType = 'Semaine';
            break;
        case 'month':
        default:
            legendType = 'Mois';
            break;
    }

    legend.append("text")
        .attr("x", options.width / 2)
        .attr("y", options.height - 5 + margin.bottom)
        .attr("text-anchor", "middle")
        .text(legendType);

    legend.append("text")
        .attr("x", -options.height / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Nombre de ventes");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return 10 + x(d.label); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return options.height - 10 - y(d.value); })
        .attr("fill", "#38a9b4")
        .on("mouseover", function(d) {
            const label = d.target.__data__.label;
            const value = parseFloat(d.target.__data__.value);
            console.log(label, value);
            tooltip.transition()
                .style("display", "block");
            tooltip.html(label + " : " + value.toFixed(2) + "€")
                .style("left", (margin.left + x(label)) + "px")
                .style("bottom", (options.height - 10 - y(value)) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .style("display", "none");
        });

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) { return d.value; })
        .attr("x", function(d) { return x(d.label) + x.bandwidth() / 2; })
        .attr("y", function(d) { return options.height - y(d.value) + 15; })
        .attr("font-size", "14px")
        .attr("text-anchor", "middle");
};


export default BarComponent;
