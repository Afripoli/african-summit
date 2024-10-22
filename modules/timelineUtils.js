import { updateMap, borderHostCountry } from "./mapUtils.js";
import { hostCountry, maxYearsToShow } from './globals.js';
// import { resetHighlights, highlightYear } from './timelineHelperUtils.js'

export function initDesktopTimelineSVG() {
    const svg = d3.select("#desktop-timeline")
        .append("svg")
        .attr("width", "auto")
        .attr("height", "100vh");
    return svg;
}

let currentYearIndex = 0;  // Declare currentYearIndex in a higher scope


export function generateTimeline(svg, summitData) {
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
    console.log('Summit data is', summitData) // we need to extract year
    appendArrows(svg, summitData, containerHeight, containerWidth);
    drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth);  // Draw the initial timeline

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
    currentYearIndex = Math.max(0, Math.min((maxIndex, currentYearIndex + direction)));
    // Redraw the timeline with the updated index
    drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth);
}
function drawTimeline(svg, summitData, currentYearIndex, containerWidth, containerHeight) {
    console.log('Current year index after update', currentYearIndex)

    console.log('Summit data in draw function is', summitData)
    const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    const circleSpacing = containerHeight / (maxYearsToShow + 1);

    // Bind the circle data and render circles
    const circleGroup = svg.selectAll("circle")
        .data(displayedYears, d => d.year);

    circleGroup.enter()
        .append("circle")
        .merge(circleGroup)
        .attr("cx", containerWidth / 2)  // Keep the circles centered horizontally
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
        .attr("x", containerWidth / 2 + 20)  // Position the label to the right of the circle
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
        .attr("x", containerWidth / 2 + 20)  // Position the country label to the right of the year label
        .attr("y", (d, i) => circleSpacing * (i + 1) + 25)  // Align with the year label
        .attr("text-anchor", "start")
        .style("fill", "gray")
        .each(function (d, i) {
            const textElement = d3.select(this);
            if (d.summits.length > 0) {
                textElement.selectAll("tspan").remove();  // Clear old tspans
                d.summits.forEach((summit, index) => {
                    textElement.append("tspan")
                        .attr("x", containerWidth / 2 + 20)  // Align tspans with country text
                        .attr("dy", index === 0 ? 0 : "1.2em")  // Adjust vertical spacing
                        .text(summit.country);
                });
            }
        });
    countryTextGroup.exit().remove();  // Remove any excess country labels

    // Bind the line data and render connecting vertical lines between circles
    const lineGroup = svg.selectAll("line")
        .data(displayedYears.slice(1));
    lineGroup.enter()
        .append("line")
        .merge(lineGroup)
        .attr("x1", containerWidth / 2)
        .attr("y1", (d, i) => circleSpacing * (i + 1) + 10)  // Start from below the previous circle
        .attr("x2", containerWidth / 2)
        .attr("y2", (d, i) => circleSpacing * (i + 2) - 10)  // End above the next circle
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    lineGroup.exit().remove();  // Remove any excess lines

    // Update button visibility based on the current index
    d3.select(".up-button").style("visibility", currentYearIndex === 0 ? "hidden" : "visible");
    d3.select(".down-button").style("visibility", currentYearIndex + maxYearsToShow >= summitData.length ? "hidden" : "visible");
}

function highlightYear(svg, summitData, year, currentYearIndex) {
    const yearIndex = summitData.findIndex(d => d.year === year);

    // Reset all circles and text to gray
    svg.selectAll("circle").attr("fill", "gray").attr("r", 5);
    svg.selectAll("text.year").style("fill", "gray");
    svg.selectAll("text.country").style("fill", "gray");

    // Highlight the selected year
    const highlightedIndex = yearIndex - currentYearIndex;
    svg.selectAll("circle").filter((_, i) => i === highlightedIndex).attr("fill", "black").attr("r", 10);
    svg.selectAll("text.year").filter((_, i) => i === highlightedIndex).style("fill", "black");
    svg.selectAll("text.country").filter((_, i) => i === highlightedIndex).style("fill", "black");

}
// export function updateDesktopTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex, summitsByCountryMap, highlightIndex, summitCounter) {
//     const totalYears = summitData.length;
//     const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
//     const circleSpacing = containerWidth / 6;

//     let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
//     const highlightedYear = displayedYears[0].year;  // Get the first year (which is highlighted)
//     let currentlyClickedIndex = null;

//     if (currentYearIndex > totalYears - maxYearsToShow) {
//         console.log('currently clicked index', currentlyClickedIndex)
//         //highlightYears(highlightIndex, totalYears, maxYearsToShow, summitData, svg, circleSpacing, currentlyClickedIndex);
//     } else if (currentYearIndex >= totalYears) {
//         console.log("Timeline has reached the end. Stopping further updates.");
//         return;
//     } else {
//         displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
//         console.log('displayed years ARRAY', displayedYears)
//         const circleGroup = svg.selectAll("circle")
//             .data(displayedYears, d => d.year);
//         circleGroup.enter()
//             .append("circle")
//             .attr("cx", (d, i) => circleSpacing * (i + 1))
//             .attr("cy", 50)  // Vertical positioning
//             .attr("r", (d, i) => i === 0 ? 10 : 5)  // Highlight first year
//             .attr("fill", (d, i) => i === 0 ? "black" : "gray")
//             .style("cursor", "pointer")  // Add cursor pointer style
//             .on("click", function (event, d) {
//                 resetHighlights(currentlyClickedIndex, circleGroup, yearTextGroup, countryTextGroup); // Reset previous highlights
//                 highlightYear(displayedYears, d.year);
//             })
//         circleGroup
//             .attr("cx", (d, i) => circleSpacing * (i + 1))
//             .attr("cy", 50)
//             .attr("r", (d, i) => i === 0 ? 10 : 5)
//             .attr("fill", (d, i) => i === 0 ? "black" : "gray");
//         // Exit phase: remove circles that are no longer needed
//         circleGroup.exit().remove();

//         // Create or update year labels
//         const yearTextGroup = svg.selectAll("text.year")
//             .data(displayedYears, d => d.year);
//         yearTextGroup.enter()
//             .append("text")
//             .attr("class", "year")
//             .attr("x", (d, i) => circleSpacing * (i + 1))
//             .attr("y", 80)
//             .attr("text-anchor", "middle")
//             .style("fill", (d, i) => i === 0 ? "" : "gray")
//             .text(d => d.year)
//             .style("cursor", "pointer")
//             .on("click", function (event, d) {
//                 resetHighlights(currentlyClickedIndex, circleGroup, yearTextGroup, countryTextGroup); // Reset previous highlights
//                 highlightYear(displayedYears, d.year);
//             })
//         yearTextGroup
//             .attr("x", (d, i) => circleSpacing * (i + 1))
//             .attr("y", 80)
//             .attr("text-anchor", "middle")
//             .style("fill", (d, i) => i === 0 ? "black" : "gray")
//             .text(d => d.year);
//         yearTextGroup.exit().remove();

//         // Create or update country labels (below the year)
//         const countryTextGroup = svg.selectAll("text.country")
//             .data(displayedYears, d => d.year);  // Using year as a unique identifier
//         countryTextGroup.enter()
//             .append("text")
//             .attr("class", "country")
//             .attr("x", (d, i) => circleSpacing * (i + 1))
//             .attr("y", 100)  // Position slightly below the year text
//             .attr("text-anchor", "middle")
//             .style("fill", "gray")
//             .each(function (d, i) {
//                 const textElement = d3.select(this);
//                 if (d.summits.length > 0) {
//                     // For each country, append a new tspan to position it vertically
//                     d.summits.forEach((summit, index) => {
//                         textElement.append("tspan")
//                             .attr("x", circleSpacing * (i + 1))  // Keep x the same for alignment
//                             .attr("dy", index === 0 ? 0 : "1.2em")  // Add vertical space for each tspan
//                             .text(summit.country);
//                     });
//                 }
//             })
//             .style("cursor", "pointer")
//             .on("click", function (event, d) {
//                 resetHighlights(currentlyClickedIndex, circleGroup, yearTextGroup, countryTextGroup); // Reset previous highlights
//                 highlightYear(displayedYears, d.year);
//             });
//         countryTextGroup
//             .attr("x", (d, i) => circleSpacing * (i + 1))
//             .attr("y", 100)
//             .attr("text-anchor", "middle")
//             .style("fill", (d, i) => i === 0 ? "black" : "gray")
//             .text(d => d.summits.length > 0 ? d.summits[0].country : "");  // Update host country
//         countryTextGroup.exit().remove();

//         // Create or update lines between the circles
//         const lineGroup = svg.selectAll("line")
//             .data(displayedYears.slice(1));
//         lineGroup.enter()
//             .append("line")
//             .attr("x1", (d, i) => circleSpacing * (i + 1) + 10)  // Start from right edge of previous circle
//             .attr("y1", 50)
//             .attr("x2", (d, i) => circleSpacing * (i + 2) - 10)  // End at the left edge of the next circle
//             .attr("y2", 50)
//             .attr("stroke", "gray")
//             .attr("stroke-width", 2)
//             .style("cursor", "pointer")

//         lineGroup
//             .attr("x1", (d, i) => circleSpacing * (i + 1) + 10)
//             .attr("y1", 50)
//             .attr("x2", (d, i) => circleSpacing * (i + 2) - 10)
//             .attr("y2", 50)
//             .attr("stroke", "gray")
//             .attr("stroke-width", 2);
//         lineGroup.exit().remove();
//     }
//     updateMap(geojsonData, summitMap, highlightedYear, summitsByCountryMap, hostCountry, summitCounter);
// }

/*
function highlightYears(highlightIndex, totalYears, maxYearsToShow, summitData, svg, circleSpacing, currentlyClickedIndex) {
    //const lastFiveYears = summitData.slice(totalYears - maxYearsToShow);  // Get last 5 years
    console.log('last five years ARRAY'. lastFiveYears)
    lastFiveYears.forEach((dataPoint, index) => {
        console.log('Index of array is', index)
        console.log(`Year: ${dataPoint.year}, Highlight Index: ${highlightIndex}`);
        // Select and update circles
        svg.selectAll("circle")
            .filter(d => d.year === dataPoint.year)  // Filter based on year
            .attr("fill", index === highlightIndex ? "black" : "gray")  // Current year is black, others are gray
            .attr("r", index === highlightIndex ? 10 : 5)
            .on("click", function (event, d) {
                console.log('Current clicked year', currentlyClickedIndex)
                resetHighlights(currentlyClickedIndex, circleGroup, yearTextGroup, countryTextGrou); // Reset previous highlights
                highlightYear(d.year);
            });

        // Select and update year text
        svg.selectAll("text.year")
            .filter(d => d.year === dataPoint.year)
            .style("fill", index === highlightIndex ? "black" : "gray")
            .on("click", function (event, d) {
                resetHighlights(currentlyClickedIndex, circle, yearTextGroup, countryTextGrou); // Reset previous highlights
                highlightYear(d.year);
            });

        // Select and update country text
        svg.selectAll("text.country")
            .filter(d => d.year === dataPoint.year)  // Filter based on year
            .style("fill", index === highlightIndex ? "black" : "gray")
            .each(function (d, i) {
                console.log('d in function is', d)
                console.log('I in function is', i)
                const textElement = d3.select(this);
                console.log('Number of summits for country', d.summits.length);
                textElement.selectAll("tspan").remove();  // Clear existing tspans to avoid stacking
                if (d.summits.length) {
                    // For each country, append a new tspan to position it vertically
                    d.summits.forEach((summit, indexSummit) => {
                        console.log('Summit is', summit, 'for index', index, 'index summit', indexSummit)
                        textElement.append("tspan")
                            .attr("x", circleSpacing * (index + 1))  // Keep x the same for alignment
                            .attr("dy", indexSummit === 0 ? 0 : "1.2em")  // Add vertical space for each tspan
                            .text(summit.country);
                    });
                }
            })
            .on("click", function (event, d) {
                currentlyClickedIndex = 1;
                resetHighlights(currentlyClickedIndex, circle, yearTextGroup, countryTextGrou); // Reset previous highlights
                highlightYear(d.year);
            });

    });
}*/
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
