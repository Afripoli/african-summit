import { updateMap } from "./mapUtils.js";
import { maxYearsToShow } from './globals.js';

let svg = null;
let timelineWidth = 0;


export function initializeTimeline() {
    const svg = d3.select("#timeline")
        .append("svg")
        .attr("width", "100%")
        .attr("height", 150);
    return svg;
}

// Function to update the timeline by displaying 5 years at a time
export function updateTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex) {
    if (currentYearIndex >= summitData.length) {
        console.log("Timeline has reached the end. Stopping further updates.");
        return;  // Exit if there are no more years to display
    }
    const containerWidth = document.getElementById("timeline").offsetWidth;
    const circleSpacing = containerWidth / 6;
    const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    const circleGroup = svg.selectAll("circle")
        .data(displayedYears, d => d.year);

    circleGroup.enter()
        .append("circle")
        .attr("cx", (d, i) => circleSpacing * (i + 1))
        .attr("cy", 50)  // Vertical positioning
        .attr("r", (d, i) => i === 0 ? 10 : 5)  // Highlight first year
        .attr("fill", (d, i) => i === 0 ? "black" : "gray");

    // Update phase: update the attributes of the circles (for reuse)
    circleGroup
        .attr("cx", (d, i) => circleSpacing * (i + 1))
        .attr("cy", 50)
        .attr("r", (d, i) => i === 0 ? 10 : 5)
        .attr("fill", (d, i) => i === 0 ? "black" : "gray");

    // Exit phase: remove circles that are no longer needed
    circleGroup.exit().remove();

    // Create or update year labels
    const yearTextGroup = svg.selectAll("text.year")
        .data(displayedYears, d => d.year);

    yearTextGroup.enter()
        .append("text")
        .attr("class", "year")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.year);

    yearTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.year);

    yearTextGroup.exit().remove();

    // Create or update country labels (below the year)
    const countryTextGroup = svg.selectAll("text.country")
        .data(displayedYears, d => d.year);  // Using year as a unique identifier

    countryTextGroup.enter()
        .append("text")
        .attr("class", "country")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100)  // Position slightly below the year text
        .attr("text-anchor", "middle")
        .style("fill", "gray")
        .text(d => d.summits.length > 0 ? d.summits[0].country : "");  // Display the host country

    countryTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("fill", "gray")
        .text(d => d.summits.length > 0 ? d.summits[0].country : "");  // Update host country

    countryTextGroup.exit().remove();

    // Create or update lines between the circles
    const lineGroup = svg.selectAll("line")
        .data(displayedYears.slice(1));

    lineGroup.enter()
        .append("line")
        .attr("x1", (d, i) => circleSpacing * (i + 1) + 10)  // Start from right edge of previous circle
        .attr("y1", 50)
        .attr("x2", (d, i) => circleSpacing * (i + 2) - 10)  // End at the left edge of the next circle
        .attr("y2", 50)
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup
        .attr("x1", (d, i) => circleSpacing * (i + 1) + 10)
        .attr("y1", 50)
        .attr("x2", (d, i) => circleSpacing * (i + 2) - 10)
        .attr("y2", 50)
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup.exit().remove();

    const highlightedYear = displayedYears[0].year;  // Get the first year (which is highlighted)
    updateMap(geojsonData, summitMap, highlightedYear);
}

// // Function to auto-advance the timeline, updating one year at a time
export function advanceTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex, intervalId) {
    if (currentYearIndex >= summitData.length) {
        console.log("Stopping timeline");
        clearInterval(intervalId);  // Stop the interval when all years are shown
        return;
    }
    // Update timeline with the current year slice
    updateTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex);
}
