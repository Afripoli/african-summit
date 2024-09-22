import { svg, width, height, scale, center, translation } from "./globals.js"

let projection = d3.geoNaturalEarth1()
    .center(center)
    .translate(translation)
let path = d3.geoPath().projection(projection);
console.log('SVG', svg)

export function drawMap(geojson) {
    console.log('geojson', geojson)
    const paths = svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#d3d3d3")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);
    console.log('Paths created for map', paths);
}

export function updateMap(geojson, countriesToHighlight) {
    svg.selectAll("path")
        .data(geojson.features)
        .transition()
        .duration(500)
        .attr("fill", d => countriesToHighlight.includes(d.properties.name) ? "orange" : "#d3d3d3");
}