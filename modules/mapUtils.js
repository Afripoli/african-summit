import { svg, width, height } from "./globals.js"

let projection = d3.geoMercator()
    .scale(400)
    .translate([width / 2, height / 2]);
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