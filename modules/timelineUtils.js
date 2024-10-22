import { updateMap, borderHostCountry } from "./mapUtils.js";
import { hostCountry, maxYearsToShow } from './globals.js';

let svg = null;

export function initDesktopTimelineSVG() {
    const svg = d3.select("#desktop-timeline")
        .append("svg")
        .attr("width", "100%")
        .attr("height", 165);
    return svg;
}

export function updateDesktopTimeline(svg, summitData, geojsonData, summitMap, currentYearIndex, summitsByCountryMap, highlightIndex, summitCounter) {
    const totalYears = summitData.length;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
    const circleSpacing = containerWidth / 6;

    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    console.log(`CurrentYear index: ${currentYearIndex}, Displaying years in timeline,`, displayedYears)
    const highlightedYear = displayedYears[0].year;  // Get the first year (which is highlighted)

    if (currentYearIndex > totalYears - maxYearsToShow) {
        highlightYears(highlightIndex, totalYears, maxYearsToShow, summitData, svg, circleSpacing);
    } else if (currentYearIndex >= totalYears) {
        console.log("Timeline has reached the end. Stopping further updates.");
        return;
    } else {
        displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
        const circleGroup = svg.selectAll("circle")
            .data(displayedYears, d => d.year);
        circleGroup.enter()
            .append("circle")
            .attr("cx", (d, i) => circleSpacing * (i + 1))
            .attr("cy", 50)  // Vertical positioning
            .attr("r", (d, i) => i === 0 ? 10 : 5)  // Highlight first year
            .attr("fill", (d, i) => i === 0 ? "black" : "gray")
            .style("cursor", "pointer")  // Add cursor pointer style
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year        
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];
                borderHostCountry(svg, hostCountries);
            })
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
            .style("fill", (d, i) => i === 0 ? "" : "gray")
            .text(d => d.year)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year

                // Get all host countries for that year
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];

                // Now highlight the host countries on the map
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
            .data(displayedYears, d => d.year);  // Using year as a unique identifier
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

                // Get all host countries for that year
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];

                // Now highlight the host countries on the map
                borderHostCountry(svg, hostCountries);
            });
        countryTextGroup
            .attr("x", (d, i) => circleSpacing * (i + 1))
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .style("fill", (d, i) => i === 0 ? "black" : "gray")
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
            .attr("stroke-width", 2)
            .style("cursor", "pointer")  // Add cursor pointer style
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year

                // Get all host countries for that year
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];

                // Now highlight the host countries on the map
                borderHostCountry(svg, hostCountries);
            });
        lineGroup
            .attr("x1", (d, i) => circleSpacing * (i + 1) + 10)
            .attr("y1", 50)
            .attr("x2", (d, i) => circleSpacing * (i + 2) - 10)
            .attr("y2", 50)
            .attr("stroke", "gray")
            .attr("stroke-width", 2);
        lineGroup.exit().remove();
    }
    updateMap(geojsonData, summitMap, highlightedYear, summitsByCountryMap, hostCountry, summitCounter);
}

function highlightYears(highlightIndex, totalYears, maxYearsToShow, summitData, svg, circleSpacing) {
    const lastFiveYears = summitData.slice(totalYears - maxYearsToShow);  // Get last 5 years
    lastFiveYears.forEach((dataPoint, index) => {
        console.log('Index of array is', index)
        console.log(`Year: ${dataPoint.year}, Highlight Index: ${highlightIndex}`);
        // Select and update circles
        svg.selectAll("circle")
            .filter(d => d.year === dataPoint.year)  // Filter based on year
            .attr("fill", index === highlightIndex ? "black" : "gray")  // Current year is black, others are gray
            .attr("r", index === highlightIndex ? 10 : 5)
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year        
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];
                borderHostCountry(hostCountries);
            });

        // Select and update year text
        svg.selectAll("text.year")
            .filter(d => d.year === dataPoint.year)  // Filter based on year
            .style("fill", index === highlightIndex ? "black" : "gray")
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];
                // Now highlight the host countries on the map
                borderHostCountry(hostCountries);
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
                        //i++
                    });
                }
                //i++;
            })
            .on("click", function (event, d) {
                const clickedYear = d.year;  // Get the year that was clicked
                const yearData = summitData.find(summit => summit.year === clickedYear);  // Get data for clicked year        
                const hostCountries = yearData.summits.length > 0
                    ? yearData.summits.map(summit => summit.country)
                    : [];
                borderHostCountry(hostCountries);
            });

    });
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
