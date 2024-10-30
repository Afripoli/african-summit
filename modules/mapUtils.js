import { svg, center, scale, translation, hostCountry, mapStyle } from "./globals.js"
import { getSummitsforCountry, displaySummitsCountry } from "./summitUtils.js"

let projection = d3.geoMercator()
    .center(center)
    .scale(scale)
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
    //console.log('Summit counter input', summitCounter)
    updateSummitCounter(summitMap, currentYear, summitCounter);
    //console.log('Host country input', hostCountry)
    //console.log('Summit map data for that current year', [currentYear], summitMap[currentYear])
    summitMap[currentYear].forEach(country => {
        //console.log('COUNTRIES IN SUMMIT MAP', country)
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
            //console.log('Country on click', d.properties.name)
            const country = d.properties.name;
            const summits = getSummitsforCountry(summitsByCountryMap, country);
            //console.log('Summit hosted in Country', summits)
            displaySummitsCountry(country, summits);  // Call function to display the summits
        });
    // Add or update summit count text inside countries
    const countryOffsets = {
        "Italy": { x: -5, y: 15 }, // Custom offset for Italy
        "South Korea": { x: -10, y: 20 }, // Custom offset for Korea
        "USA": { x: 0, y: 20 }, // Custom offset for USA
        "China": { x: -25, y: 0 }, // Custom offset for Turkey
        "France": { x: -40, y: 0 }, // Custom offset for France
        "Saudi Arabia": { x: -20, y: 0 }, // Custom offset for Saudi Arabia
        "India": { x: -20, y: 0 }, // Custom offset for India
        "Japan": { x: -15, y: 0 }, // Custom offset for Japan
    };
    svg.selectAll("text")
        .data(geojsonData.features)
        .join("text")
        .attr("transform", d => {
            const centroid = path.centroid(d);
            // Get the country name
            const countryName = d.properties.name;

            // Default offsets
            let offsetX = 0;
            let offsetY = 0;

            // Check if there are specific offsets for the country
            if (countryOffsets[countryName]) {
                offsetX = countryOffsets[countryName].x;
                offsetY = countryOffsets[countryName].y;
            }

            // Apply the offsets
            return `translate(${centroid[0] + offsetX}, ${centroid[1] + offsetY})`;
        })
        .attr("dy", ".25em")
        .attr("text-anchor", "start")
        .attr("font-size", "14px")
        .attr("font-weight", "450")
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
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            const country = d.properties.name;
            const summits = getSummitsforCountry(summitsByCountryMap, country);
            displaySummitsCountry(country, summits);  // Call function to display the summits
        });
}

// select host country
function colorHostCountry(svg, hostCountry) {
    console.log('Coloring host country', hostCountry)
    svg.selectAll("path")
        .attr("fill", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderHost : mapStyle.defaultFill)
        //.attr("stroke", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderHost : mapStyle.defaultBorder)
        //.attr("stroke-width", d => (hostCountry.includes(d.properties.name)) ? mapStyle.borderWidthHost : mapStyle.defaultBorderWidth) // Thicker stroke for host countries
        .style("cursor", d => (hostCountry.includes(d.properties.name)) ? "pointer" : "default") // Change cursor for host countries
        .transition()
        .duration(500)
}

export function borderClickedCountry(svg, hostCountries, countriesWithSummits) {
    console.log('Set countries with summits in borderHostCountry', countriesWithSummits)
    console.log('Bordering host countries', hostCountries)
    d3.selectAll("path")
        .each(function (d) {
            if (countriesWithSummits.has(d.properties.name)) {
                d3.select(this)
                    .attr("fill", mapStyle.fillHost)  // Reset to yellow for countries with summits
                    .attr("stroke", mapStyle.defaultBorder)
                    .attr("stroke-width", mapStyle.defaultBorderWidth);
            }
        });
    d3.selectAll("path")
        .each(function (d) {
            if (hostCountries.includes(d.properties.name)) {
                d3.select(this)
                    .attr("fill", mapStyle.clickedYearCountry)  // Set to orange for host countries
            }
        });
}


