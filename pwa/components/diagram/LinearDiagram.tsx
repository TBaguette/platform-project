import { useEffect, useRef, useState } from "react";
import { BaseType } from "d3";
import * as d3 from "d3";
import InputLinearComponent from "../input/InputLinearDiagram";
import Data from "../interface/Data";

const LinearComponent = () => {
    const refChart = useRef<HTMLDivElement>(null);
    const [data, setData] = useState([]);
    const [type, setType] = useState("maison");

    useEffect(() => {
        if (refChart.current !== null) {
            refChart.current.classList.add("loading");
            refChart.current.classList.add("isChargedFirstTime");
        }

        async function fetchData() {
            const response = await fetch("/sale_evolution/" + type);
            const data = await response.json();
            setData(data["hydra:member"]);
            if (refChart.current !== null)
                refChart.current.classList.remove("loading");
        }
        fetchData();
    }, [refChart, type]);

    useEffect(() => {
        const margin = { top: 20, right: 20, bottom: 60, left: 65 };

        if (SVG.data === undefined) {
            SVG.LinearChartSVG(refChart.current, data, margin, {
                width: 500 - margin.left - margin.right,
                height: 500 - margin.top - margin.bottom,
            });
        } else {
            SVG.update(data);
        }
    }, [data]);

    return (
        <div
            className={"chart" + (data.length !== 0 ? "" : " loading")}
            data-testid="chart"
            ref={refChart}
        >
            <div className="legend-chart">Prix moyen du mètre carré</div>
            <InputLinearComponent type={type} setType={setType} />
        </div>
    );
};

export class SVG {
    static data: Data[];
    static svg: d3.Selection<SVGGElement, unknown, null, undefined>;
    static x: d3.ScaleTime<number, number, never>;
    static y: d3.ScaleLinear<number, number>;
    static xAxis: d3.Axis<Date | d3.NumberValue>;
    static yAxis: d3.Axis<number | d3.NumberValue>;
    static xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    static yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    static tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    static margin: { top: number; right: number; bottom: number; left: number };

    static LinearChartSVG(
        element: BaseType,
        data: Data[],
        margin: { top: number; right: number; bottom: number; left: number },
        options: {
            width: number;
            height: number;
        }
    ) {
        if (data.length < 2) return;

        SVG.data = data;

        d3.select(element).select("svg").remove();

        const svg = d3
            .select(element)
            .append("svg")
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3
            .scaleTime()
            .domain([
                new Date(
                    parseInt(data[0].label.split("/")[1]),
                    parseInt(data[0].label.split("/")[0]) - 1
                ),
                new Date(
                    parseInt(data[data.length - 1].label.split("/")[1]),
                    parseInt(data[data.length - 1].label.split("/")[0]) - 1
                ),
            ])
            .range([0, options.width]);

        let y = d3
            .scaleLinear()
            .domain([
                Math.min(...data.map((item) => item.value)) - 10,
                Math.max(...data.map((item) => item.value)) + 10,
            ])
            .range([options.height, 0]);

        let xAxisGroup = svg
            .append("g")
            .attr("transform", "translate(0," + options.height + ")");

        let yAxisGroup = svg.append("g").attr("transform", "translate(0,0)");

        let xAxis = d3
            .axisBottom(x)
            .tickArguments([d3.timeMonth.every(3), d3.timeFormat("%b %Y")])
            .tickSize(5);

        let yAxis = d3.axisLeft(y).tickSize(0);

        xAxisGroup
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(45) translate(30,0)");

        yAxisGroup.call(yAxis);

        let line = d3
            .line<Data>()
            .x(function (d) {
                return x(
                    new Date(
                        parseInt(d.label.split("/")[1]),
                        parseInt(d.label.split("/")[0]) - 1
                    )
                );
            })
            .y(function (d) {
                return y(d.value);
            });

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#38a9b4")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        const tooltip = d3
            .select(element)
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

        const points = svg.selectAll(".point").data(data).enter();

        points
            .append("circle")
            .attr("cx", (d) =>
                x(
                    new Date(
                        parseInt(d.label.split("/")[1]),
                        parseInt(d.label.split("/")[0]) - 1
                    )
                )
            )
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("fill", "#38a9b4")
            .attr("display", (d) => (d.value === 0 ? "none" : "block"))
            .attr("class", "point")
            .style("cursor", "pointer")
            .on("mouseover", function (d) {
                const label = d.target.__data__.label;
                const value = parseFloat(d.target.__data__.value);
                tooltip.transition().style("display", "block");
                tooltip
                    .html(label + " : " + value.toFixed(2) + "€")
                    .style(
                        "left",
                        margin.left +
                            x(
                                new Date(
                                    label.split("/")[1],
                                    parseInt(label.split("/")[0]) - 1
                                )
                            ) +
                            "px"
                    )
                    .style("top", margin.top + y(value) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition().style("display", "none");
            });

        let legend = svg.append("g");

        legend
            .append("text")
            .attr("class", "legend")
            .attr("x", options.width / 2)
            .attr("y", options.height + margin.bottom - 1)
            .attr("text-anchor", "middle")
            .text("Mois");

        legend
            .append("text")
            .attr("class", "legend")
            .attr("x", -options.height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Prix");

        SVG.svg = svg;
        SVG.x = x;
        SVG.y = y;
        SVG.xAxis = xAxis;
        SVG.yAxis = yAxis;
        SVG.xAxisGroup = xAxisGroup;
        SVG.yAxisGroup = yAxisGroup;
        SVG.tooltip = tooltip;
        SVG.margin = margin;
    }

    static update(data: Data[]) {
        if (data.length < 2) return;

        SVG.data = data;

        const svg = SVG.svg;
        const x = SVG.x;
        const y = SVG.y;
        const xAxis = SVG.xAxis;
        const yAxis = SVG.yAxis;
        const xAxisGroup = SVG.xAxisGroup;
        const yAxisGroup = SVG.yAxisGroup;
        const tooltip = SVG.tooltip;
        const margin = SVG.margin;

        // update the scales with the new data
        x.domain([
            new Date(
                parseInt(data[0].label.split("/")[1]),
                parseInt(data[0].label.split("/")[0]) - 1
            ),
            new Date(
                parseInt(data[data.length - 1].label.split("/")[1]),
                parseInt(data[data.length - 1].label.split("/")[0]) - 1
            ),
        ]);
        y.domain([
            Math.min(...data.map((item) => item.value)) - 10,
            Math.max(...data.map((item) => item.value)) + 10,
        ]);

        // update the line
        const line = d3
            .line<Data>()
            .x(function (d) {
                return x(
                    new Date(
                        parseInt(d.label.split("/")[1]),
                        parseInt(d.label.split("/")[0]) - 1
                    )
                );
            })
            .y(function (d) {
                return y(d.value);
            });

        svg.select(".line")
            .datum(data)
            .transition()
            .duration(500)
            .attr("d", line);

        // update the points
        const points = svg
            .selectAll<SVGCircleElement, Data>("circle.point")
            .data(data);

        points
            .enter()
            .append("circle")
            .attr("cx", (d) =>
                x(
                    new Date(
                        parseInt(d.label.split("/")[1]),
                        parseInt(d.label.split("/")[0]) - 1
                    )
                )
            )
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("fill", "#38a9b4")
            .attr("display", (d) => (d.value === 0 ? "none" : "block"))
            .attr("class", "point")
            .style("cursor", "pointer")
            .on("mouseover", function (d) {
                const label = d.target.__data__.label;
                const value = parseFloat(d.target.__data__.value);
                tooltip.transition().style("display", "block");
                tooltip
                    .html(label + " : " + value.toFixed(2) + "€")
                    .style(
                        "left",
                        margin.left +
                            x(
                                new Date(
                                    label.split("/")[1],
                                    parseInt(label.split("/")[0]) - 1
                                )
                            ) +
                            "px"
                    )
                    .style("top", margin.top + y(value) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition().style("display", "none");
            })
            .merge(points)
            .transition()
            .duration(500)
            .attr("cx", (d) =>
                x(
                    new Date(
                        parseInt(d.label.split("/")[1]),
                        parseInt(d.label.split("/")[0]) - 1
                    )
                )
            )
            .attr("cy", (d) => y(d.value));

        points.exit().remove();

        xAxisGroup.transition().duration(500).call(xAxis);
        yAxisGroup.transition().duration(500).call(yAxis);

        SVG.svg = svg;
        SVG.x = x;
        SVG.y = y;
        SVG.xAxis = xAxis;
        SVG.yAxis = yAxis;
        SVG.xAxisGroup = xAxisGroup;
        SVG.yAxisGroup = yAxisGroup;
        SVG.tooltip = tooltip;
        SVG.margin = margin;
    }
}

export default LinearComponent;
