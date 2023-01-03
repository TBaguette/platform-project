import * as d3 from "d3";
import { BaseType } from "d3";
import { useEffect, useRef, useState } from "react";
import InputBarComponent from "../input/InputBarDiagram";
import Data from "../interface/Data";

const BarComponent = () => {
    const refChart = useRef<HTMLDivElement>(null);
    const [data, setData] = useState(null);
    const [type, setType] = useState("month");
    const [dateStart, setDateStart] = useState("2018-01-01");
    const [dateEnd, setDateEnd] = useState("2018-06-30");

    useEffect(() => {
        if (refChart.current !== null) {
            refChart.current.classList.add("loading");
            refChart.current.classList.add("isChargedFirstTime");
        }

        async function fetchData() {
            const res = await fetch(
                "/number_sales_by_date/" +
                    type +
                    "/" +
                    dateStart +
                    "/" +
                    dateEnd
            );
            const data = await res.json();
            setData(data["hydra:member"]);
            if (refChart.current !== null)
                refChart.current.classList.remove("loading");
        }
        fetchData();
    }, [refChart, type, dateStart, dateEnd]);

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };

        if (data === null) return;

        if (SVG.data === undefined) {
            SVG.BarChartSVG(refChart.current, data, type, margin, {
                width: 500 - margin.left - margin.right,
                height: 500 - margin.top - margin.bottom,
            });
        } else {
            SVG.update(data, type);
        }
    }, [data]);

    return (
        <div
            className={"chart" + (data !== null ? "" : " loading")}
            data-testid="chart"
            ref={refChart}
        >
            <div className="legend-chart">Nombre de ventes par intervalle</div>
            <InputBarComponent
                type={type}
                setType={setType}
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
            />
        </div>
    );
};

export class SVG {
    static data: Data[];
    static svg: d3.Selection<SVGGElement, unknown, null, undefined>;
    static x: d3.ScaleBand<string>;
    static y: d3.ScaleLinear<number, number>;
    static xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    static yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    static tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    static margin: { top: number; right: number; bottom: number; left: number };
    static options: {
        width: number;
        height: number;
    };

    static BarChartSVG(
        element: BaseType,
        data: Data[],
        type: string,
        margin: { top: number; right: number; bottom: number; left: number },
        options: {
            width: number;
            height: number;
        }
    ) {
        SVG.data = data;

        d3.select(element).select("svg").remove();

        let svg;
        let xAxisGroup;
        let yAxisGroup;

        svg = d3
            .select(element)
            .append("svg")
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "svg")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        xAxisGroup = svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(10," + (options.height - 10) + ")");

        yAxisGroup = svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(10,0)");

        const x = d3
            .scaleBand()
            .domain(
                data.map(function (d) {
                    return d.label;
                })
            )
            .range([0, options.width - 10])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, Math.max(...data.map((item) => item.value)) + 1000])
            .range([options.height - 10, 0]);

        let xAxis = d3
            .axisBottom(x)
            .tickFormat(function (d, i) {
                if (
                    data.length < 20 ||
                    i % Math.floor(data.length / 10) === 0
                ) {
                    return d;
                }
                return "";
            })
            .tickSize(5);

        let yAxis = d3.axisLeft(y).ticks(10).tickSize(5);

        xAxisGroup
            .call(xAxis)
            .selectAll("text")
            .attr(
                "transform",
                type !== "year" ? "rotate(45) translate(30,0)" : ""
            );

        yAxisGroup.call(yAxis);

        let tooltip = d3
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

        let legend = svg.append("g").attr("class", "legend");

        let legendType = "Mois";
        switch (type) {
            case "year":
                legendType = "Année";
                break;
            case "day":
                legendType = "Jour";
                break;
            case "week":
                legendType = "Semaine";
                break;
            case "month":
            default:
                legendType = "Mois";
                break;
        }

        legend
            .append("text")
            .attr("class", "x legend")
            .attr("x", options.width / 2)
            .attr("y", options.height - 5 + margin.bottom)
            .attr("text-anchor", "middle")
            .text(legendType);

        legend
            .append("text")
            .attr("class", "y legend")
            .attr("x", -options.height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Nombre de ventes");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                const pxLabel = x(d.label);
                if (pxLabel) return 10 + pxLabel;
                return 10;
            })
            .attr("y", options.height - 10)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", "#38a9b4")
            .on("mouseover", function (d) {
                const label = d.target.__data__.label;
                const value = parseFloat(d.target.__data__.value);
                tooltip.transition().style("display", "block");
                tooltip
                    .html(label + " : " + value.toFixed(2) + " ventes")
                    .style("left", function () {
                        const pxLabel = x(label);
                        if (pxLabel) return margin.left + pxLabel + "px";
                        return margin.left + "px";
                    })
                    .style("bottom", options.height - 10 - y(value) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition().style("display", "none");
            })
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return options.height - 10 - y(d.value);
            });

        SVG.svg = svg;
        SVG.x = x;
        SVG.y = y;
        SVG.xAxisGroup = xAxisGroup;
        SVG.yAxisGroup = yAxisGroup;
        SVG.tooltip = tooltip;
        SVG.margin = margin;
        SVG.options = options;
    }

    static update(data: Data[], type: string) {
        SVG.data = data;

        const svg = SVG.svg;
        const x = SVG.x;
        const y = SVG.y;
        const tooltip = SVG.tooltip;
        const margin = SVG.margin;
        const options = SVG.options;

        x.domain(data.map((d) => d.label))
            .range([0, options.width - 10])
            .padding(0.1);
        y.domain([0, Math.max(...data.map((item) => item.value)) + 1000]).range(
            [options.height - 10, 0]
        );

        svg.selectAll("rect").remove();

        let legendType = "Mois";
        switch (type) {
            case "year":
                legendType = "Année";
                break;
            case "day":
                legendType = "Jour";
                break;
            case "week":
                legendType = "Semaine";
                break;
            case "month":
            default:
                legendType = "Mois";
                break;
        }
        svg.select(".legend").select(".x.legend").text(legendType);

        let xAxis = d3
            .axisBottom(x)
            .tickFormat(function (d, i) {
                if (
                    data.length < 20 ||
                    i % Math.floor(data.length / 10) === 0
                ) {
                    return d;
                }
                return "";
            })
            .tickSize(5);

        let yAxis = d3.axisLeft(y).ticks(10).tickSize(5);
        SVG.xAxisGroup.transition().duration(500).style("opacity", 0).remove();
        SVG.yAxisGroup.transition().duration(500).style("opacity", 0).remove();
        SVG.xAxisGroup = svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(10," + (options.height - 10) + ")")
            .style("opacity", 0);
        SVG.yAxisGroup = svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(10,0)")
            .style("opacity", 0);

        SVG.xAxisGroup
            .transition()
            .duration(500)
            .style("opacity", 1)
            .call(xAxis)
            .selectAll("text")
            .attr(
                "transform",
                type !== "year" ? "rotate(45) translate(30,0)" : ""
            );
        SVG.yAxisGroup
            .transition()
            .duration(500)
            .style("opacity", 1)
            .call(yAxis);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                const pxLabel = x(d.label);
                if (pxLabel) return 10 + pxLabel;
                return 10;
            })
            .attr("y", options.height - 10)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", "#38a9b4")
            .on("mouseover", function (d) {
                const label = d.target.__data__.label;
                const value = parseFloat(d.target.__data__.value);
                tooltip.transition().style("display", "block");
                tooltip
                    .html(label + " : " + value.toFixed(2) + " ventes")
                    .style("left", function () {
                        const pxLabel = x(label);
                        if (pxLabel) return margin.left + pxLabel + "px";
                        return margin.left + "px";
                    })
                    .style("bottom", options.height - 10 - y(value) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition().style("display", "none");
            })
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return options.height - 10 - y(d.value);
            });

        SVG.svg = svg;
        SVG.x = x;
        SVG.y = y;
        SVG.tooltip = tooltip;
        SVG.margin = margin;
        SVG.options = options;
    }
}

export default BarComponent;
