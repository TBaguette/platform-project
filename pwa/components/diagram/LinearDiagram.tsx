import {useEffect, useRef} from "react";
import {BaseType} from "d3";
import * as d3 from "d3";

const LinearComponent = () => {

  const refChart = useRef(null);

  useEffect(() => {
    const data = [
      { year: 2017, price: 100 },
      { year: 2018, price: 110 },
      { year: 2019, price: 105 },
      { year: 2020, price: 115 },
      { year: 2021, price: 120 }
    ];

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    LinearChartSVG(refChart.current, data, margin, {
      width: 400,
      height: 400
    });
  }, [refChart]);

  return <div className="chart" ref={refChart}></div>
}

const LinearChartSVG = (element: BaseType, data: { year: number, price: number }[], margin: {top: number, right: number, bottom: number, left: number}, options : {
  width: number,
  height: number
}) => {

  // ajouter une balise SVG à la page HTML
  let svg = d3.select(element)
    .append("svg")
    .attr("width", options.width)
    .attr("height", options.height);

  // ajouter un titre au diagramme
  svg.append("text")
    .attr("x", options.width / 2) // positionner le titre au milieu de l'axe des X
    .attr("y", margin.top) // positionner le titre en haut du diagramme
    .attr("text-anchor", "middle") // centrer le titre
    .attr("font-size", "20px") // définir la taille du titre
    .text("Prix moyen du mètre carré");


  // définir l'échelle pour l'axe des X
  let xScale = d3.scaleTime()
    .domain([new Date(2017, 0, 1), new Date(2021, 0, 1)]) // définir l'intervalle de données pour l'axe des X
    .range([0, options.width]); // définir l'intervalle de l'espace de l'axe des X

// définir l'échelle pour l'axe des Y
  let yScale = d3.scaleLinear()
    .domain([0, 200]) // définir l'intervalle de données pour l'axe des Y
    .range([options.height, 0]); // définir l'intervalle de l'espace de l'axe des Y

  // ajouter un groupe pour l'axe des X
  let xAxisGroup = svg.append("g")
    .attr("transform", "translate(0," + (options.height - margin.bottom) + ")");

  // ajouter un groupe pour l'axe des Y
  let yAxisGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)");

  // ajouter une étiquette "Année" à l'axe des X
  xAxisGroup.append("text")
    .attr("x", options.width / 2) // positionner l'étiquette au milieu de l'axe des X
    .attr("y", margin.bottom - 5) // décaler l'étiquette vers le bas de l'axe
    .attr("text-anchor", "middle") // centrer l'étiquette sur l'axe
    .text("Année");

  // ajouter une étiquette "Prix" à l'axe des Y
  yAxisGroup.append("text")
    .attr("x", -options.height / 2) // positionner l'étiquette au milieu de l'axe des Y
    .attr("y", -margin.left + 10) // décaler l'étiquette vers la gauche de l'axe
    .attr("text-anchor", "middle") // aligner l'étiquette à gauche de l'axe
    .attr("transform", "rotate(-90)") // faire pivoter l'étiquette de 90 degrés
    .text("Prix");

  // créer l'axe des X en utilisant l'échelle pour l'axe des X
  let xAxis = d3.axisBottom(xScale)
    .ticks(5) // définir le nombre de marques sur l'axe
    .tickFormat(d3.timeFormat("%Y")) // définir le format de l'axe
    .tickSize(0);

  // créer l'axe des Y en utilisant l'échelle pour l'axe des Y
  let yAxis = d3.axisLeft(yScale)
    .ticks(5) // définir le nombre de marques sur l'axe
    .tickSize(0);

  // ajouter l'axe des X au groupe de l'axe des X
  xAxisGroup.call(xAxis);

  // ajouter l'axe des Y au groupe de l'axe des Y
  yAxisGroup.call(yAxis);


  // sélectionner et lier les données
  let points = svg.selectAll(".point")
    .data(data)
    .enter(); // créer des éléments pour chaque point de données

  // ajouter des points à l'aide de balises <circle>
  points.append("circle")
    .attr("cx", (d) => xScale(d.year)) // définir la position en X des points en utilisant l'échelle pour l'axe des X
    .attr("cy", (d) => yScale(d.price)) // définir la position en Y des points en utilisant l'échelle pour l'axe des Y
    .attr("r", 5) // définir le rayon des points
    .attr("fill", "steelblue") // définir la couleur des points
    .attr("class", "point"); // ajouter une classe aux points

  // définir la méthode pour tracer une ligne
  let line = d3.line()
    .x(function(d) { return xScale(new Date(d.year, 0, 1)); }) // utiliser l'échelle pour l'axe des X pour mapper les données d'année sur l'espace de l'axe des X
    .y(function(d) { return yScale(d.price); }) // utiliser l'échelle pour l'axe des Y pour mapper les données de prix sur l'espace de l'axe des Y

  // ajouter une balise <path> à l'SVG pour tracer la ligne
  svg.append("path")
    .datum(data) // définir les données pour la ligne
    .attr("fill", "none") // enlever le remplissage
    .attr("stroke", "steelblue") // définir la couleur de la ligne
    .attr("stroke-width", 1.5) // définir l'épaisseur de la ligne
    .attr("d", line); // utiliser la fonction de tracé de ligne pour définir le d attribut
};

export default LinearComponent;
