import {
    mapStyle,
    mapMobileWidth
} from "../common/globals.js";
import { getSummitsforCountry, displaySummitsCountry } from "../desktop/summitUtils.js";

let mapheightAlt = window.innerHeight - 50 - 400;
let mapMobileHeight = window.innerHeight - 50 - 400;

console.log('Map height alt', mapheightAlt)
let projection = d3.geoMercator().center([0, 0]).scale(80).translate([mapMobileWidth / 2.05, mapMobileHeight / 1.5]); // do not move coord unless svg size is changed!
let path = d3.geoPath().projection(projection);

//console.log('Map mobile height', mapMobileHeight)
const svg = d3.select("#map-mobile")
    .append("svg")
    .attr("width", `${mapMobileWidth}`)
    .attr("height", `${mapMobileHeight}`)
    //.attr("viewBox", `0 0 ${mapMobileWidth} ${mapheightAlt}`)
    //.attr("preserveAspectRatio", "xMidYMid meet");

export function initializeMobileMap(geojsonData) {
    // Draw the map
    drawMap(svg, geojsonData);

    // Add zoom buttons
    addZoomButtons(svg);

    // Apply zoom behavior to the SVG
    svg.call(zoom);

    // Make the map responsive
    window.addEventListener('resize', () => resizeMap(svg, geojsonData));
}

const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Set the scale extent for zooming
    .on("zoom", zoomed);

function zoomed(event) {
    svg.selectAll("path").attr("transform", event.transform);
    // svg.selectAll(".country-label")
    //     .attr("transform", event.transform)
    //     .style("font-size", function () {
    //         return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
    //     });
}

function drawMap(svg, geojsonData) {
    const paths = svg
        .selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", mapStyle.defaultFill)
        .attr("stroke", mapStyle.defaultBorder)
        .attr("stroke-width", mapStyle.defaultBorderWidth);

    // Apply zoom behavior to the SVG
    svg.call(zoom);
}

function addZoomButtons(svg) {
    console.log('Height and width', mapMobileHeight, mapMobileWidth)
    const zoomInButton = svg.append("g")
        .attr("id", "zoomInButton")
        .attr("class", "zoom-button zoom-in")
        .attr("transform", `translate(${mapMobileWidth - 40}, ${mapMobileHeight - 80})`)
        .on("click", () => {
            console.log('Zoom in button id', zoomInButton.attr("id"))
            handleButtonClick(svg, zoomInButton.attr("id"))
        });
    zoomInButton.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
    zoomInButton.append("text")
        .attr("x", 10)
        .attr("y", 17.5)
        .attr("text-anchor", "middle")
        .attr("font-size", "22px")
        .attr("fill", "#000")
        .attr("class", "fw-semibold")
        .text("+");

    // Create zoom out button
    const zoomOutButton = svg.append("g")
        .attr("id", "zoomOutButton")
        .attr("class", "zoom-button zoom-out")
        .attr("transform", `translate(${mapMobileWidth - 40}, ${mapMobileHeight - 55})`)
        .on("click", () => {
            console.log('Zoom out button id', zoomOutButton.attr("id"))
            handleButtonClick(svg, zoomOutButton.attr("id"))
        });

    zoomOutButton.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    zoomOutButton.append("text")
        .attr("x", 10)
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "#000")
        .text("-");
    //svg.call(zoom);
}

function handleButtonClick(svg, buttonId) {
    console.log(`Button ${buttonId} clicked`);

    // Add your button click handling logic here
    switch (buttonId) {
        case 'zoomInButton':
            // Logic for Zoom In
            svg.transition().call(zoom.scaleBy, 2); // Zoom in by a factor of 2
            break;
        case 'zoomOutButton':
            // Logic for Zoom Out
            svg.transition().call(zoom.scaleBy, 0.5); // Zoom out by a factor of 0.5
            break;
        default:
            console.log(`No handler for button ${buttonId}`);
    }
}

export function updateMapByYear(svg, geojsonData, year, cumulativeSummits, summitsByCountryMap) {
    console.log("Year in updateMapByYear", year);
    console.log("Passing cumulative summits in updateMapByYear", cumulativeSummits);
    clearCountryLabels(svg);
    const yearData = cumulativeSummits.get(year.year);
    console.log("Year data in updateMapByYear", yearData);
    console.log("Summits by country map in updateMapByYear", summitsByCountryMap);
    const cumulative = yearData.cumulative;
    console.log('Cumulative summits in updateMapByYear', yearData.cumulative);
    const newCountries = yearData.new;

    console.log('New countries', newCountries)
    // Color the countries
    svg
        .selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => {
            const country = d.properties.name;
            console.log(`Country: ${country}, New: ${newCountries.has(country)}`);
            if (newCountries.has(country)) {
                console.log(`Coloring ${country} as new country`);
                console.log('Color', mapStyle.clickedYearCountry)
                return `${mapStyle.clickedYearCountry}`; // Brown color for new countries
            }
            else {
                return `${mapStyle.defaultFill}`; // Default color for other countries
            }
        })
    // Add or update summit count text inside countries
    /*
    svg.selectAll("text")
      .data(geojsonData.features)
      .join("text")
      .attr("class", "country-counter country-label")
      .attr("x", d => {
        const countryName = d.properties.name;
        return (countryOffsets[countryName]?.x || 0) + path.centroid(d)[0];
      })
      .attr("y", d => {
        const countryName = d.properties.name;
        return (countryOffsets[countryName]?.y || 0) + path.centroid(d)[1];
      })
      .attr("dy", ".25em")
      .attr("text-anchor", `${mapStyle.textAnchor}`)
      .attr("alignment-baseline", `${mapStyle.alignmentBaseline}`)
      .attr("font-size", `${mapStyle.fontSize}`)
      .attr("font-weight", `${mapStyle.fontWeight}`)
      .text((d) => {
        const iso = d.id;
        const countryName = d.properties.name;
        const count = cumulative.has(countryName)
          ? cumulative.get(countryName)
          : undefined;
        if (count !== undefined) {
          return `${iso}: ${count}`; // Format text as "Country: count"
        } else {
          return ""; // Return empty string if not in cumulative
        }
      });
      */

    // Apply zoom transformation to newly added labels
    //console.log('Current zoom scale in updateMapByYear', currentZoomScale)
    // svg.selectAll(".country-label")
    //   .attr("transform", d3.zoomTransform(svg.node()))
    //   .style("font-size", function() {
    //     return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
    //   });

    // Ensure button text is not removed
    svg.selectAll(".button-text").raise();

    svg.call(zoom);
}

// Function to clear existing labels
function clearCountryLabels() {
    svg.selectAll(".country-label").remove();
    svg.selectAll(".country-counter").remove();
}

// Function to resize the map
function resizeMap(svg, geojsonData) {
    const width = document.getElementById('map-mobile').clientWidth;
    const height = document.getElementById('map-mobile').clientHeight;
    console.log('Resizing map to width:', width, 'height:', height);
    svg.attr("width", width).attr("height", height);

    // Redraw the map with the updated dimensions
    drawMap(svg, geojsonData);
}

export function updateMapByCountry(svg, geojsonData, selectedCountry) {
    console.log("Selected country in updateMapByCountry", selectedCountry);

    // Color the selected country
    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
            const country = d.properties.name;
            return country === selectedCountry ? `${mapStyle.clickedYearCountry}` : `${mapStyle.defaultFill}`; // Red color for selected country, default color for others
        })
    //.style("cursor", "pointer")
    // .on("click", function (event, d) {
    //     const country = d.properties.name;
    //     const summits = getSummitsforCountry(summitsByCountryMap, country);
    //     displaySummitsCountry(country, summits); // Call function to display the summits
    // });

    // Ensure button text is not removed
    svg.selectAll(".button-text").raise();
    //svg.call(zoom);
}