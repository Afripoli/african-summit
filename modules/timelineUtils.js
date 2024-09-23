import { updateMap } from "./mapUtils.js";

let startIndex = 0;
const itemsPerPage = 5;
let currentYearIndex = 0;

// timelineUtils.js

// Function to update the timeline by displaying 5 years at a time
export function updateTimeline(summitData, geojsonData, currentIndex) {
    // Extract the years to display, starting from the current index
    const yearsToDisplay = summitData.slice(currentIndex, currentIndex + 5);

    // Select the timeline container
    const timeline = d3.select("#timeline");

    // Remove existing years before rendering new ones
    timeline.selectAll("div").remove();

    // Append new years to the timeline
    yearsToDisplay.forEach((d, i) => {
        const yearDiv = appendYearToTimeline(timeline, d.year, i === 0);
        
        // Update the map with the countries that hosted summits in this year
        if (i === 0) { 
            const countries = d.summits.map(summit => summit.country);
            updateMap(geojsonData, countries);
        }
    });
}

// Function to append a year to the timeline
function appendYearToTimeline(timeline, year, isHighlighted) {
    const yearDiv = timeline.append("div")
        .attr("class", "timeline-year")
        .text(year)
        .style("font-weight", isHighlighted ? "bold" : "normal")
        .style("color", isHighlighted ? "black" : "gray");
    
    return yearDiv;
}

// Function to auto-advance the timeline, updating one year at a time
export function autoAdvanceTimeline(summitData, geojsonData) {
    let currentIndex = 0;

    // Function to advance the timeline every few seconds
    const advance = () => {
        // Check if there are more years to display
        if (currentIndex + 5 < summitData.length) {
            currentIndex++; // Move the timeline forward by one year
        } else {
            // Reset the index to restart the timeline
            currentIndex = 0;
        }

        // Update the timeline with the new range of years
        updateTimeline(summitData, geojsonData, currentIndex);
    };

    // Start advancing the timeline every 3 seconds
    setInterval(advance, 3000);
}
