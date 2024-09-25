import { updateMap } from "./mapUtils.js";

const itemsPerPage = 5;
let currentYearIndex = 0;
let svg = null;

export function initializeTimeline() {
    const timelineContainer = d3.select("#timeline");

    // Check if the SVG already exists, if not create it
    if (!svg) {
        svg = timelineContainer.append("svg")
            .attr("width", 800)
            .attr("height", 100);
    }
}

// Function to update the timeline by displaying 5 years at a time
export function updateTimeline(summitData, geojsonData, summitMap, currentYearIndex) {
    const maxYearsToShow = 5;
    const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    if (!svg) {
        console.error('SVG is not initialized. Call initializeTimeline() first.');
        return;
    }
    const circleGroup = svg.selectAll("circle")
        .data(displayedYears, d => d.year);

    // Enter phase: append new circles if needed
    circleGroup.enter()
        .append("circle")
        .attr("cx", (d, i) => 100 + i * 120)  // Horizontal spacing
        .attr("cy", 50)  // Vertical positioning
        .attr("r", (d, i) => i === 0 ? 10 : 5)  // Highlight first year
        .attr("fill", (d, i) => i === 0 ? "black" : "gray");

    // Update phase: update the attributes of the circles (for reuse)
    circleGroup
        .attr("cx", (d, i) => 100 + i * 120)
        .attr("cy", 50)
        .attr("r", (d, i) => i === 0 ? 10 : 5)
        .attr("fill", (d, i) => i === 0 ? "black" : "gray");

    // Exit phase: remove circles that are no longer needed
    circleGroup.exit().remove();

    // Create or update year labels
    const textGroup = svg.selectAll("text")
        .data(displayedYears, d => d.year);

    textGroup.enter()
        .append("text")
        .attr("x", (d, i) => 100 + i * 120)
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.year);

    textGroup
        .attr("x", (d, i) => 100 + i * 120)
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => i === 0 ? "black" : "gray")
        .text(d => d.year);

    textGroup.exit().remove();

    // Create or update lines between the circles
    const lineGroup = svg.selectAll("line")
        .data(displayedYears.slice(1));  // Don't connect the first circle

    lineGroup.enter()
        .append("line")
        .attr("x1", (d, i) => 100 + i * 120 + 10)  // Start from right edge of previous circle
        .attr("y1", 50)
        .attr("x2", (d, i) => 100 + (i + 1) * 120 - 10)  // End at the left edge of the next circle
        .attr("y2", 50)
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup
        .attr("x1", (d, i) => 100 + i * 120 + 10)
        .attr("y1", 50)
        .attr("x2", (d, i) => 100 + (i + 1) * 120 - 10)
        .attr("y2", 50)
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup.exit().remove();


    // Update the map for the first displayed year
    const highlightedYear = displayedYears[0].year;  // Get the first year (which is highlighted)
    updateMap(geojsonData, summitMap, highlightedYear);

}

// Function to append a year to the timeline
// function appendYearToTimeline(timeline, year, isHighlighted) {
//     const yearDiv = timeline.append("div")
//         .attr("class", "timeline-year")
//         .text(year)
//         .style("font-weight", isHighlighted ? "bold" : "normal")
//         .style("color", isHighlighted ? "black" : "gray");

//     return yearDiv;
// }

// // Function to auto-advance the timeline, updating one year at a time
export function autoAdvanceTimeline(summitData, geojsonData, summitMap, currentIndex) {

    console.log('Summit data', summitData)
    // let currentIndex = 0;

    // Function to advance the timeline every few seconds
    const advance = () => {
        // Check if there are more years to display
        if (currentIndex + 5 < summitData.length) {
            currentIndex++; // Move the timeline forward by one year
        } else {
            // Reset the index to restart the timeline
            currentIndex = 0;
        }
        updateTimeline(summitData, geojsonData, summitMap, currentIndex);
    };

    // Start advancing the timeline every 3 seconds
    setInterval(advance, 1000);
}
