import * as d3 from "d3";
import { BaseType, PieArcDatum } from "d3";
import { useEffect, useRef, useState } from "react";
import InputDonutComponent from "../input/InputDonutDiagram";
import Data from "../interface/Data";

const DonutComponent = () => {
    const refChart = useRef<HTMLDivElement>(null);
    const [data, setData] = useState([]);
    const [year, setYear] = useState(2017);

    useEffect(() => {
        if (refChart.current !== null) {
            refChart.current.classList.add("loading");
            refChart.current.classList.add("isChargedFirstTime");
        }

        async function fetchData() {
            const res = await fetch("/count_by_year/" + year);
            const data: any = await res.json();
            setData(data["hydra:member"]);
            if (refChart.current !== null)
                refChart.current.classList.remove("loading");
        }
        fetchData();
    }, [refChart, year]);

    useEffect(() => {
        if (data === null) return;
        if (data.length === 0) return;

        SVG.DonutChartSVG(refChart.current, data, {
            width: 700,
            height: 500,
        });
    }, [data]);

    return (
        <div
            className={"chart" + (data.length !== 0 ? "" : " loading")}
            data-testid="chart"
            ref={refChart}
        >
            <div className="legend-chart">
                Répartition des ventes par région
            </div>
            <InputDonutComponent year={year} setYear={setYear} />
        </div>
    );
};

export class SVG {
    static DonutChartSVG(
        element: BaseType,
        data: Data[],
        options: {
            width: number;
            height: number;
        }
    ) {
        d3.select(element).select("svg").remove();

        const colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateLab("#8ad4db", "#246e75"))
            .domain([0, data.length]);

        const svg = d3
            .select(element)
            .append("svg")
            .attr("width", options.width)
            .attr("height", options.height)
            .append("g")
            .attr(
                "transform",
                `translate(${options.width / 2}, ${options.height / 2})`
            );

        const arcGenerator = d3
            .arc<PieArcDatum<Data>>()
            .cornerRadius(10)
            .padAngle(0.02)
            .innerRadius(50)
            .outerRadius(150);

        const pieGenerator = d3.pie<Data>().value((d: Data) => d.value);

        const arc = svg.selectAll().data(pieGenerator(data)).enter();

        arc.append("path")
            .attr("d", arcGenerator)
            .style("fill", (_, i) => colorScale(i));

        arc.append("text")
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text((d) => d.data.value + "%")
            .style("font-weight", "bold")
            .style("fill", "#ffffff")
            .attr("transform", (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });

        arc.append("text")
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text((d) => d.data.label)
            .style("fill", "#000000")
            .attr("transform", (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x * 2.1}, ${y * 2.1})`;
            });

        arc.append("line")
            .style("stroke", "#000000")
            .style("stroke-width", 1.5)
            .attr("x1", (d) => {
                const [x, _] = arcGenerator.centroid(d);
                return `${x * 1.25}`;
            })
            .attr("y1", (d) => {
                const [_, y] = arcGenerator.centroid(d);
                return `${y * 1.25}`;
            })
            .attr("x2", (d) => {
                const [x, _] = arcGenerator.centroid(d);
                return `${x * 1.75}`;
            })
            .attr("y2", (d) => {
                const [_, y] = arcGenerator.centroid(d);
                return `${y * 1.75}`;
            });
    }
}

export default DonutComponent;
