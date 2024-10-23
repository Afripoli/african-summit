import { svg, center, translation } from "./globals.js"
import { getSummitsforCountry, displaySummitsCountry } from "./summitUtils.js"

let projection = d3.geoNaturalEarth1()
    .center(center)
    .translate(translation)
let path = d3.geoPath().projection(projection);


export function drawMap(geojson) {
    //console.log('geojson', geojson)
    const paths = svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#fff")
        .attr("stroke", "#46474c")
        .attr("stroke-width", 0.15);
}

function updateSummitCounter(summitMap, currentYear, summitCounter) {
    //console.log('Summit map has current year', summitMap)
    summitMap[currentYear].forEach(country => {
        console.log('Country in summit map', country);
        summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
    });
}

export function updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter) {
    updateSummitCounter(summitMap, currentYear, summitCounter);
    summitMap[currentYear].forEach(country => {
        hostCountry.push(country);
        colorHostCountry(svg, hostCountry)
        //summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
    });
    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .on("click", function (event, d) {
            console.log('Country on click', d.properties.name)
            const country = d.properties.name;
            const summits = getSummitsforCountry(summitsByCountryMap, country);
            console.log('Summit hosted in Country', summits)
            displaySummitsCountry(country, summits);  // Call function to display the summits
        });
    // Add or update summit count text inside countries
    svg.selectAll("text")
        .data(geojsonData.features)
        .join("text")
        .attr("transform", d => {
            const centroid = path.centroid(d);
            return `translate(${centroid})`
        })
        .attr("dy", ".25em")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "600")
        .text(d => summitCounter.has(d.properties.name) ? summitCounter.get(d.properties.name) : '');
}

// select host country
function colorHostCountry(svg, hostCountry) {
    //console.log('Coloring host country', hostCountry)
    svg.selectAll("path")
        .attr("fill", d => (hostCountry.includes(d.properties.name)) ? "#fec03c" : "#fff")
        .attr("stroke", d => (hostCountry.includes(d.properties.name)) ? "#ff5733" : "#46474c")
        .attr("stroke-width", d => (hostCountry.includes(d.properties.name)) ? 1 : 0.5) // Thicker stroke for host countries
        .style("cursor", d => (hostCountry.includes(d.properties.name)) ? "pointer" : "default") // Change cursor for host countries
        .transition()
        .duration(500)
}

export function borderHostCountry(hostCountries) {
    //const hostCountry = yearData.summits.length > 0 ? yearData.summits[0].country : null; // Get the host country for that year
    console.log('Bordering host countries', hostCountries)
    d3.selectAll("path")
        .attr("stroke", d => (hostCountries.includes(d.properties.name)) ? "blue" : "#46474c")
        .attr("stroke-width", d => (hostCountries.includes(d.properties.name)) ? 4 : 0.5) // Thicker stroke for host countries
        .style("cursor", d => (hostCountries.includes(d.properties.name)) ? "pointer" : "default") // Change cursor for host countries
}

