import { svg, width, height, scale, center, translation } from "./globals.js"

const coloredCountries = {};

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

export function updateMap(geojsonData, countries) {
    // Update country colors based on the summit hosting status
    updateCountryColors(countries);

    // Remove previous text elements before updating
    d3.selectAll("text").remove();

    // Add or update text (summit counters) inside the corresponding countries
    addSummitCounters(geojsonData);
}

// Function to update the colors of the countries based on the hosting status
function updateCountryColors(countries) {
    d3.selectAll("path")
        .attr("fill", d => {
            return countries.includes(d.properties.name) ? "orange" : "#d3d3d3";
        });
}

// Function to calculate the center of each country and append text to display summit counts
function addSummitCounters(geojsonData) {
    console.log('GeoJSON for COUNTER', geojsonData)
    d3.selectAll("path")
        .each(function(d) {
            const countryName = d.properties.name;
            console.log('Country name', countryName)
            // If the country has hosted summits, show the summit count
            if (coloredCountries[countryName]) {
                const count = coloredCountries[countryName].count;

                // Append a text element inside the country
                appendSummitCounter(d, count);
            }
        });
}

// Function to append the summit counter text inside the country
function appendSummitCounter(countryData, count) {
    console.log('country data', countryData)
    console.log('COUNT', count)
    const centroid = path.centroid(countryData); // Get the centroid for positioning

    d3.select("svg").append("text")
        .attr("x", centroid[0])  // Position the text in the center of the country
        .attr("y", centroid[1])
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")  // Vertically align the text
        .text(count)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "black");
}
