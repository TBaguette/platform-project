import * as d3 from "d3";
import { BaseType } from "d3";
import { MutableRefObject, useEffect, useRef, useState } from "react";

const DonutComponent = () => {
    const refChart = useRef(null);
    const [data, setData] = useState([]);
    const [year, setYear] = useState(2017);

    useEffect(() => {
        if(refChart.current !== null)
            refChart.current.classList.add('loading');


        async function fetchData() {
            const res = await fetch('/sales/count-by-year/' + year);
            const data = await res.json();
            setData(data);
            if(refChart.current !== null)
                refChart.current.classList.remove('loading');
        }
        fetchData();
    }, [refChart, year]);


    useEffect(() => {
        DonutChartSVG(refChart.current, data, {
            width: 700,
            height: 500
        });
    }, [data]);

    return <div className={"chart" + (data.length !== 0 ? "" : " loading")} ref={refChart}>
        <form>
            <label>
                Choisissez une année :
                <div className="choice">
                    <input
                        type="number"
                        min="2017"
                        max="2022"
                        value={year}
                        onChange={event => setYear(parseInt(event.target.value))}
                    />
                    <span className="up" onClick={() => { if(year+1 <= 2022) setYear(year+1) }}/>
                    <span className="down" onClick={() => { if(year-1 >= 2017) setYear(year-1) }}/>
                </div>
            </label>
        </form>
    </div>
}

const DonutChartSVG = (element: BaseType, data: { label: string, value: number }[], options : {
    width: number,
    height: number
}) => {
    const colorScale = d3  
        .scaleSequential()
        .interpolator(d3.interpolateCool)
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
        .style('fill', (_, i) => colorScale(i));
    
    arc
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text((d) => d.data.value + "%")
        .style('font-weight', 'bold')
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