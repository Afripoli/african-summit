import { svg, width, height, scale, center, translation } from "./globals.js"

let summitCounter = new Map();

let projection = d3.geoNaturalEarth1()
    .center(center)
    .translate(translation)
let path = d3.geoPath().projection(projection);

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
}

function resetSummitCounter() {
    summitCounter.clear();
}
function updateSummitCounter(summitMap, currentYear) {
    console.log('Summit map in function', summitMap)
    console.log('Current year', currentYear)
    console.log('Summit has year',summitMap[currentYear])
    //if (summitMap.has(currentYear)) {
        console.log('Summit map has current year', summitMap)
        summitMap[currentYear].forEach(country => {
            console.log('Country in summit map', country)
            summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
        });
   // }
}

export function updateMap(geojsonData, summitMap, currentYear) {
    //resetSummitCounter()
    updateSummitCounter(summitMap, currentYear);
    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => summitCounter.has(d.properties.name) ? "#f39c12" : "#d3d3d3")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

    // Add or update summit count text inside countries
    svg.selectAll("text")
        .data(geojsonData.features)
        .join("text")
        .attr("transform", d => {
            const centroid = path.centroid(d);
            return `translate(${centroid})`;
        })
        .attr("dy", ".5em")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(d => summitCounter.has(d.properties.name) ? summitCounter.get(d.properties.name) : '');
}





