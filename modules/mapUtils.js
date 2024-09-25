import { svg, width, height, scale, center, translation } from "./globals.js"

const coloredCountries = {};
let summitCounter = new Map();
let geojsonData;
let summitData;

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

// // Function to color all countries based on cumulative summit counts
// function colorAccumulatedCountries(svg, summitCounter) {
//     svg.selectAll("path")
//         .attr("fill", d => {
//             const countryName = d.properties.name;
//             return summitCounter[countryName] ? "#f39c12" : "#d3d3d3";  // Highlight countries that hosted summits
//         });
// }

// // Function to add or update summit counters on the map for accumulated summits
// function updateSummitCounters(svg, geojsonData, summitCounter) {
//     svg.selectAll("text").remove(); 
//     svg.selectAll("path").each(function(d) {
//         const countryName = d.properties.name;
//         if (summitCounter[countryName]) {
//             const centroid = d3.geoPath().centroid(d);  // Get the center of the country
//             svg.append("text")
//                 .attr("x", centroid[0])
//                 .attr("y", centroid[1])
//                 .attr("text-anchor", "middle")
//                 .attr("fill", "black")
//                 .attr("font-size", "12px")
//                 .text(summitCounter[countryName]);  // Display the cumulative summit count
//         }
//     });
// }

// // Function to update the colors of the countries based on the hosting status
// function updateCountryColors(countries) {
//     d3.selectAll("path")
//         .attr("fill", d => {
//             return countries.includes(d.properties.name) ? "orange" : "#d3d3d3";
//         });
// }

// // Function to calculate the center of each country and append text to display summit counts
// function addSummitCounters(geojsonData) {
//     console.log('GeoJSON for COUNTER', geojsonData)
//     d3.selectAll("path")
//         .each(function(d) {
//             const countryName = d.properties.name;
//             //console.log('Country name', countryName)
//             // If the country has hosted summits, show the summit count
//             if (coloredCountries[countryName]) {
//                 const count = coloredCountries[countryName].count;

//                 // Append a text element inside the country
//                 appendSummitCounter(d, count);
//             }
//         });
// }

// // Function to append the summit counter text inside the country
// function appendSummitCounter(countryData, count) {
//     console.log('country data', countryData)
//     console.log('COUNT', count)
//     const centroid = path.centroid(countryData); // Get the centroid for positioning

//     d3.select("svg").append("text")
//         .attr("x", centroid[0])  // Position the text in the center of the country
//         .attr("y", centroid[1])
//         .attr("text-anchor", "middle")
//         .attr("dy", ".35em")  // Vertically align the text
//         .text(count)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .style("fill", "black");
// }
