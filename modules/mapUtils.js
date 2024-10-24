import { svg, center, translation, hostCountry, mapStyle } from "./globals.js"
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
        .attr("fill", mapStyle.defaultFill)
        .attr("stroke", mapStyle.defaultBorder)
        .attr("stroke-width", mapStyle.defaultBorderWidth);
}

function updateSummitCounter(summitMap, currentYear, summitCounter) {
    //console.log('Summit map has current year', summitMap)
    summitMap[currentYear].forEach(country => {
        console.log('Country in summit map', country);
        summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
    });
}

export function updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter) {
    console.log('Summit counter input', summitCounter)
    updateSummitCounter(summitMap, currentYear, summitCounter);
    console.log('Host country input', hostCountry)
    console.log('Summit map data for that current year', [currentYear], summitMap[currentYear])
    summitMap[currentYear].forEach(country => {
        console.log('COUNTRIES IN SUMMIT MAP', country)
        hostCountry.push(country);
        colorHostCountry(svg, hostCountry)
        //summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
    });
    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => {
            const country = d.properties.name;
            return summitCounter.has(country) ? mapStyle.fillHost : mapStyle.defaultFill; // Fill orange if present in the map, else white
        })
        .style("cursor", "pointer")
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
            console.log('Centroid is', centroid)
            return `translate(${centroid})`
        })
        .attr("dy", ".25em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12.5px")
        .attr("font-weight", "600")
        .text(d => {
            const iso = d.id;
            const countryName = d.properties.name; // Get country name
            const count = summitCounter.has(countryName) ? summitCounter.get(countryName) : undefined;
            // Only display if the country is in summitCounter
            if (count !== undefined) {
                const iso = d.id || '';  // Get ISO abbreviation
                return `${iso}: ${count}`; // Format text as "ISO: count"
            } else {
                return ''; // Return empty string if not in summitCounter
            }
        })
        .style("cursor", "pointer");
}

// select host country
function colorHostCountry(svg, hostCountry) {
    console.log('Coloring host country', hostCountry)
    svg.selectAll("path")
        .attr("fill", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderHost : mapStyle.defaultFill)
        .attr("stroke", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderHost : mapStyle.defaultBorder)
        .attr("stroke-width", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderWidthHost : mapStyle.defaultBorderWidth) // Thicker stroke for host countries
        .style("cursor", d => (hostCountry.includes(d.properties.name)) ? "pointer" : "default") // Change cursor for host countries
        .transition()
        .duration(500)
}

export function borderHostCountry(svg, hostCountries) {
    //const hostCountry = yearData.summits.length > 0 ? yearData.summits[0].country : null; // Get the host country for that year
    console.log('Bordering host countries', hostCountries)
    d3.selectAll("path")
        .attr("stroke", d => (hostCountries.includes(d.properties.name)) ? mapStyle.defaultBorder : mapStyle.borderHost)
        .attr("stroke-width", d => (hostCountries.includes(d.properties.name)) ? 4 : mapStyle.borderWidthHost) // Thicker stroke for host countries
        .style("cursor", d => (hostCountries.includes(d.properties.name)) ? "pointer" : "default") // Change cursor for host countries
}

'#fec03c'