import * as d3 from "d3";
import { BaseType } from "d3";
import { MutableRefObject, useEffect, useRef } from "react";

const DonutComponent = () => {
    const refChart = useRef(null);

    useEffect(() => {
        const data = [
            {label: "Bretagne", value: 5},
            {label: "Nouvelle Aquitaine", value: 22},
            {label: "Occitanie", value: 16},
            {label: "Centre Val de Loire", value: 8},
            {label: "Normandie", value: 11.5},
            {label: "Ile de France", value: 13},
            {label: "Grand Est", value: 12},
            {label: "...", value: 12.5}
        ];

        DonutChartSVG(refChart.current, data, {
            width: 500,
            height: 500
        });
    }, [refChart]);

    return <div className="chart" ref={refChart}></div>
}

const DonutChartSVG = (element: BaseType, data: { label: string, value: number }[], options : {
    width: number,
    height: number
}) => {
    const colorScale = d3  
        .scaleSequential()
        .interpolator(d3.interpolateWarm)
        .domain([0, data.length]);

    d3 
        .select(element)
        .select('svg')
        .remove();
    
    const svg = d3
        .select(element)
        .append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
        .append('g')
        .attr('transform', `translate(${options.width / 2}, ${options.height / 2})`);

    const arcGenerator = d3
        .arc()
        .cornerRadius(10)
        .padAngle(0.02)
        .innerRadius(50)
        .outerRadius(150);

    const pieGenerator = d3
        .pie()
        .value((d) => d.value);

    const arc = svg
        .selectAll()
        .data(pieGenerator(data))
        .enter();
    
    arc
        .append('path')
        .attr('d', arcGenerator)
        .style('fill', (_, i) => colorScale(i))
        .style('stroke', '#ffffff')
        .style('stroke-width', 0);
    
    arc
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text((d) => d.data.value + "%")
        .style('fill', '#ffffff')
        .attr('transform', (d) => {
            const [x, y] = arcGenerator.centroid(d);
            return `translate(${x}, ${y})`;
        });
    
    arc
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text((d) => d.data.label)
        .style('fill', '#000000')
        .attr('transform', (d) => {
            const [x, y] = arcGenerator.centroid(d);
            return `translate(${x*2.1}, ${y*2.1})`;
        });
    
    arc
        .append('line')
        .style('stroke', '#000000')
        .style('stroke-width', 1.5)
        .attr('x1', (d) => {
            const [x, _] = arcGenerator.centroid(d);
            return `${x*1.25}`;
        })
        .attr('y1', (d) => {
            const [_, y] = arcGenerator.centroid(d);
            return `${y*1.25}`;
        })
        .attr('x2', (d) => {
            const [x, _] = arcGenerator.centroid(d);
            return `${x*1.75}`;
        })
        .attr('y2', (d) => {
            const [_, y] = arcGenerator.centroid(d);
            return `${y*1.75}`;
        });
};


export default DonutComponent;