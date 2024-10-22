import { updateMap, borderHostCountry } from "./mapUtils.js";
import { hostCountry, maxYearsToShow } from './globals.js';

// Initial states
let timelineRunning = false;


export function initDesktopTimelineSVG() {
    const svg = d3.select("#desktop-timeline")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    return svg;
}

export function generateTimeline(svg, summitData, currentYearIndex) {
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
    console.log('Summit data is', summitData) // we need to extract year
    // Display the first 5 years by default
    drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth);
    // Append arrows for timeline navigation
    //appendArrows(svg, summitData, containerHeight, containerWidth);
}

export function startTimeline(svg, summitData) {
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
    if (!timelineRunning) {
        timelineRunning = true;
        // Call the updateTimeline function to handle automatic navigation
        updateTimeline(1, svg, summitData, currentYearIndex, containerHeight, containerWidth);
    }
}

function appendArrows(svg, summitData, containerHeight, containerWidth) {
    const upArrowDiv = document.createElement("div");
        upArrowDiv.classList.add("arrow-container", "up-arrow");
        upArrowDiv.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.getElementById("desktop-timeline").appendChild(upArrowDiv);
        // Append the Down Arrow (Bottom)
        const downArrowDiv = document.createElement("div");
        downArrowDiv.classList.add("arrow-container", "down-arrow");
        downArrowDiv.innerHTML = '<i class="fas fa-chevron-down"></i>';
        document.getElementById("desktop-timeline").appendChild(downArrowDiv);
        // Add click event listeners to the arrows
        upArrowDiv.addEventListener("click", () => updateTimeline(-1, svg, summitData, containerHeight, containerWidth));  // Move up
        downArrowDiv.addEventListener("click", () => updateTimeline(1, svg, summitData, containerHeight, containerWidth)); 
}
function updateTimeline(direction, svg, summitData, containerHeight, containerWidth) {
    console.log('Direction', direction, 'Summit Data', summitData)
    console.log('Max year to show', maxYearsToShow);
    const maxIndex = Math.max(0, summitData.length - maxYearsToShow);  // Calculate the maximum index
    // Update the current index based on direction
    console.log('Current year index before update', currentYearIndex)
    currentYearIndex = Math.max(0, Math.min((maxIndex, currentYearIndex + direction + maxYearsToShow)));
    // Redraw the timeline with the updated index
    drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth);
}
export function drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth) {
    console.log('Current year index after update', currentYearIndex)
    console.log('Summit data in draw function is', summitData)
   const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the current set of years

    const circleSpacing = containerHeight / (maxYearsToShow);
    // Bind the circle data and render circles
    const circleGroup = svg.selectAll("circle")
        .data(displayedYears, d => d.year);
    circleGroup.enter()
        .append("circle")
        .merge(circleGroup)
        .attr("cx", containerWidth / 3)  // Keep the circles centered horizontally
        .attr("cy", (d, i) => circleSpacing * (i + 1))  // Space them vertically
        .attr("r", (d, i) => i === 0 ? 10 : 5)  // Make the first circle bigger
        .attr("fill", "gray")
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            highlightYear(svg, summitData, d.year, currentYearIndex);  // Highlight the clicked year
        });

    circleGroup.exit().remove();  // Remove any excess circles

    // Bind the year label data and render year labels next to the circles
    const yearTextGroup = svg.selectAll("text.year")
        .data(displayedYears, d => d.year);
    yearTextGroup.enter()
        .append("text")
        .attr("class", "year")
        .merge(yearTextGroup)
        .attr("x", (containerWidth / 3) + 10)  // Position the label to the right of the circle
        .attr("y", (d, i) => circleSpacing * (i + 1) + 5)  // Align with the circle vertically
        .attr("text-anchor", "start")
        .text(d => d.year)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            highlightYear(svg, summitData, d.year, currentYearIndex);  // Highlight the clicked year
        });
    yearTextGroup.exit().remove();  // Remove any excess year labels

    // Bind the country label data and render country labels next to the year
    const countryTextGroup = svg.selectAll("text.country")
        .data(displayedYears, d => d.year);
    countryTextGroup.enter()
        .append("text")
        .attr("class", "country")
        .merge(countryTextGroup)
        .attr("x", (containerWidth / 3) + 1)  // Position the country label to the right of the year label
        .attr("y", (d, i) => circleSpacing * (i + 1) + 25)  // Align with the year label
        .attr("text-anchor", "start")
        .style("fill", "gray")
        .each(function (d, i) {
            const textElement = d3.select(this);
            if (d.summits.length > 0) {
                textElement.selectAll("tspan").remove();  // Clear old tspans
                d.summits.forEach((summit, index) => {
                    textElement.append("tspan")
                        .attr("x", (containerWidth / 3) + 10)  // Align tspans with country text
                        .attr("dy", index === 0 ? 0 : "1.2em")  // Adjust vertical spacing
                        .text(summit.country);
                });
            }
        });
    countryTextGroup.exit().remove();  // Remove any excess country labels
        console.log('Displayed year in timeline util', displayedYears)
    // Bind the line data and render connecting vertical lines between circles
    const lineGroup = svg.selectAll("line")
        .data(displayedYears.slice(1));
    lineGroup.enter()
        .append("line")
        .merge(lineGroup)
        .attr("x1", containerWidth / 3)
        .attr("y1", (d, i) => circleSpacing * (i + 1) + 10)  // Start from below the previous circle
        .attr("x2", containerWidth / 3)
        .attr("y2", (d, i) => circleSpacing * (i + 2) - 10)  // End above the next circle
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup.exit().remove();  // Remove any excess lines
    console.log('Summit data check', summitData)
    // Update button visibility based on the current index
    d3.select(".up-button").style("visibility", currentYearIndex === 0 ? "hidden" : "visible");
    d3.select(".down-button").style("visibility", currentYearIndex + maxYearsToShow >= summitData.length ? "hidden" : "visible");
}

export function highlightYear(svg, summitData, currentYearIndex) {
   // Remove highlight from all circles and text
   svg.selectAll('circle').attr('r', 5).attr('fill', 'gray');  // Reset all circles to default size and color
   svg.selectAll('text.year').style('font-weight', 'normal').style('fill', 'black');  // Reset year text

   // Find the circle and text for the year to highlight
   const currentYearData = summitData[currentYearIndex];  // Get the current year data using the index
//     console.log('Current year data', currentYearData)
//    const circles = svg.selectAll('circle').filter(d => d.year === currentYearData.year);
//    const texts = svg.selectAll('text.year').filter(d => d.year === currentYearData.year);

   if (currentYearData || (currentYearData && currentYearData.year <= 2024)) {
    // If currentYearData exists, filter the circles based on the current year
    const circles = svg.selectAll('circle').filter(d => d.year === currentYearData.year);
    const texts = svg.selectAll('text.year').filter(d => d.year === currentYearData.year);
    
    // Apply highlight (larger circle, different color, bold text)
   circles.attr('r', 10).attr('fill', 'orange');  // Highlighted circle
   texts.style('font-weight', 'bold').style('fill', 'orange'); 
}
   
}

export function initMobileTimelineSVG() {
    const svg = d3.select("#mobile-timeline")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
    return svg;
}
export function mobileTimeline(svg, summitData, currentYearIndex) {
    const circleSpacing = 0;
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + 1);
    const yearTextGroup = svg.selectAll("text.year")
        .data(displayedYears, d => d.year);
    yearTextGroup.enter()
        .append("text")
        .attr("class", "year")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "" : "gray")
        .text(d => d.year)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            const clickedYear = d.year;  // Get the year that was clicked
            const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year
            const hostCountries = yearData.summits.length > 0
                ? yearData.summits.map(summit => summit.country)
                : [];
            borderHostCountry(svg, hostCountries);
        })
    yearTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.year);
    yearTextGroup.exit().remove();

    // Create or update country labels (below the year)
    const countryTextGroup = svg.selectAll("text.country")
        .data(displayedYears, d => d.year);
    countryTextGroup.enter()
        .append("text")
        .attr("class", "country")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100)  // Position slightly below the year text
        .attr("text-anchor", "middle")
        .style("fill", "gray")
        .each(function (d, i) {
            const textElement = d3.select(this);
            if (d.summits.length > 0) {
                // For each country, append a new tspan to position it vertically
                d.summits.forEach((summit, index) => {
                    textElement.append("tspan")
                        .attr("x", circleSpacing * (i + 1))  // Keep x the same for alignment
                        .attr("dy", index === 0 ? 0 : "1.2em")  // Add vertical space for each tspan
                        .text(summit.country);
                });
            }
        })
        .style("cursor", "pointer")  // Add cursor pointer style
        .on("click", function (event, d) {
            const clickedYear = d.year;  // Get the year that was clicked
            const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year
            const hostCountries = yearData.summits.length > 0
                ? yearData.summits.map(summit => summit.country)
                : [];
            borderHostCountry(svg, hostCountries);
        });
    countryTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.summits.length > 0 ? d.summits[0].country : "");  // Update host country
    countryTextGroup.exit().remove();
}

// // Function to auto-advance the timeline, updating one year at a time
export function advanceTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, hostCountry, highlightIndex, summitCounter) {
    console.log('Current year index', currentYearIndex);
    if (currentYearIndex >= summitData.length) {
        console.log("Stopping timeline");
        clearInterval(intervalId);  // Stop the interval when all years are shown
        return;
    }
    // Update timeline with the current year slice
    updateDesktopTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex, summitsByCountryMap, hostCountry, highlightIndex, summitCounter);
}
