import { svg, width, height, scale, center, translation } from "./globals.js"
import { getSummitsforCountry, displaySummitsCountry } from "./summitUtils.js"

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
function updateSummitCounter(svg, summitMap, currentYear) {
    console.log('Summit map in function', summitMap)
    console.log('Current year', currentYear)
    console.log('Summit has year',summitMap[currentYear])
    //if (summitMap.has(currentYear)) {
        console.log('Summit map has current year', summitMap)
        summitMap[currentYear].forEach(country => {
            console.log('Country in summit map', country);
            summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
        });
   // }
}

export function updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry) {
    //resetSummitCounter()
    updateSummitCounter(svg, summitMap, currentYear, hostCountry);   

    summitMap[currentYear].forEach(country => {
        console.log('Country in summit map', country);
        console.log('HOST COUNTRY IN LOOP', hostCountry)
        hostCountry.push(country);
        colorHostCountry(svg, hostCountry)
        //summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
    });

    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .on("click", function(event, d) {
            console.log('Country on click', d.properties.name)
            const country = d.properties.name;
            const summits = getSummitsforCountry(summitsByCountryMap, country);
            console.log('Summit hosted in Country', summits)
            displaySummitsCountry(country, summits);  // Call function to display the summits
        });
        //colorHostCountry(svg, hostCountry)
    // Add or update summit count text inside countries
    svg.selectAll("text")
        .data(geojsonData.features)
        .join("text")
        .attr("transform", d => {
            const centroid = path.centroid(d);
            return `translate(${centroid})`
        })
        .attr("dy", ".5em")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(d => summitCounter.has(d.properties.name) ? summitCounter.get(d.properties.name) : '');
}

// select host country
function colorHostCountry(svg, hostCountry) {
    console.log('host country in function', hostCountry)
    svg.selectAll("path")
        .attr("fill", d => (hostCountry.includes(d.properties.name)) ? "#0043ff" : "#ccc")
        .transition()
        .duration(500)
}



