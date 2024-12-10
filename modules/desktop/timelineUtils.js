import {
    updateMap,
    borderClickedCountry,
    updateMapByYear,
} from "./mapUtils.js";
import { arrowsClickListener } from "./initDesktop.js";
import { displaySummitsYear } from "./summitUtils.js";
import { maxYearsToShow, timelineStyle, timelineHorizontalAlign } from "../common/globals.js";

export function initDesktopTimelineSVG() {
    const svg = d3
        .select("#desktop-timeline")
        .append("svg")
        .attr("width", "100%") // Readjust when BS columns are responsive
        .attr("height", "450px");
    return svg;
}

export function generateTimeline(
    svg,
    geojsonData,
    summitData,
    currentYearIndex,
    displayedYears,
    countriesWithSummits,
    cumulativeSummits,
    summitsByCountryMap
) {
    console.log("Passing summit data in generateTimeline function", summitData);
    drawTimeline(
        svg,
        geojsonData,
        summitData,
        currentYearIndex,
        displayedYears,
        countriesWithSummits,
        cumulativeSummits,
        summitsByCountryMap
    );
}
export function drawTimeline(
    svg,
    geojsonData,
    summitData,
    currentYearIndex,
    displayedYears,
    countriesWithSummits,
    cumulativeSummits,
    summitsByCountryMap
) {
    const containerHeight = svg.node().getBoundingClientRect().height;
    const containerWidth = svg.node().getBoundingClientRect().width;
    const circleSpacing = containerHeight / (maxYearsToShow + 1);

    // Draw the timeline circles
    const circleGroup = svg
        .selectAll("circle")
        .data(displayedYears, (d) => d.year);
    circleGroup
        .enter()
        .append("circle")
        .merge(circleGroup)
        .attr("cx", containerWidth / timelineHorizontalAlign) // Keep the circles centered horizontally
        .attr("cy", (d, i) => circleSpacing * (i + 1) - circleSpacing / 4) // Adjust to start first circle at top
        .attr("r", (d, i) => (i === 0 ? 10 : 5)) // Make the first circle bigger
        .attr("fill", `${timelineStyle.notActiveNode}`)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
            console.log("Data for the clicked year", yearData);
            const hostCountries = yearData.summits.map((summit) => summit.country);
            console.log("Host country clicked", hostCountries);
            highlightClickedItem(svg, geojsonData, d, cumulativeSummits, summitsByCountryMap);
            //borderClickedCountry(svg, hostCountries, countriesWithSummits);
            updateMapByYear(geojsonData, yearData, cumulativeSummits, summitsByCountryMap);
        });

    circleGroup.exit().remove(); // Remove any excess circles

    // Calculate positions of the first and last items
    const firstItemPosition = circleSpacing * 1 - (circleSpacing / 3);
    const lastItemPosition = circleSpacing * displayedYears.length - (circleSpacing / 3);

    // Append up arrow
    svg.append("text")
        .attr("x", containerWidth / timelineHorizontalAlign)  // Center horizontally
        .attr("y", firstItemPosition - 20)  // Position above the first item
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", `${timelineStyle.arrowActive}`)
        .attr("class", "up-arrow")
        .style("cursor", "pointer")
        .text("▲");

    // Append down arrow
    svg.append("text")
        .attr("x", containerWidth / timelineHorizontalAlign)  // Center horizontally
        .attr("y", lastItemPosition + 100)  // Position below the last item
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", `${timelineStyle.arrowActive}`)
        .attr("class", "down-arrow")
        .style("cursor", "pointer")
        .text("▼");
    // Append line between arrows and circles
    svg.append("line")
        .attr("x1", containerWidth / timelineHorizontalAlign)
        .attr("y1", firstItemPosition - 50)  // Position just below the up arrow
        .attr("x2", containerWidth / timelineHorizontalAlign)
        .attr("y2", lastItemPosition + 100)  // Position just above the down arrow
        .attr("stroke", `${timelineStyle.arrowLineColor}`)
        .attr("stroke-width", `${timelineStyle.arrowLineWeight}`);

    arrowsClickListener(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits, summitsByCountryMap);

    // Define margin bottom after each year
    const marginBottom = 40;

    // Bind the year label data and render year labels next to the circles
    const yearTextGroup = svg
        .selectAll("text.year")
        .data(displayedYears, (d) => d.year);
    yearTextGroup
        .enter()
        .append("text")
        .attr("class", "year")
        .merge(yearTextGroup)
        .attr("x", containerWidth / timelineHorizontalAlign + timelineStyle.marginYearLeft) // Position the label to the right of the circle
        .attr("y", (d, i) => circleSpacing * (i + 1) + 5 - circleSpacing / 3) // Align with the circle vertically
        .attr("text-anchor", "start")
        .text((d) => d.year)
        .style("cursor", "pointer")
        .style("font-size", `${timelineStyle.fontItem}`)
        .style("font-weight", `${timelineStyle.fontWeightHighlight}`)
        .on("click", function (event, d) {
            console.log("Summit data in timeline util", summitData);
            const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
            console.log("Data for the clicked year", yearData);
            const hostCountries = yearData.summits.map((summit) => summit.country);
            console.log("Host country clicked", hostCountries);
            highlightClickedItem(svg, geojsonData, d, cumulativeSummits, summitsByCountryMap);
            //borderClickedCountry(svg, hostCountries, countriesWithSummits);
            (geojsonData, yearData, cumulativeSummits);
        });
    yearTextGroup.exit().remove(); // Remove any excess year labels

    // Bind the country label data and render country labels next to the year
    const countryTextGroup = svg
        .selectAll("text.country")
        .data(displayedYears, (d) => d.year);
    countryTextGroup
        .enter()
        .append("text")
        .attr("class", "country")
        .merge(countryTextGroup)
        .attr("x", containerWidth / timelineHorizontalAlign) // Position the country label to the right of the year label
        .attr("y", (d, i) => circleSpacing * (i + 1) + 25 - circleSpacing / 3) // Align with the year label
        .attr("text-anchor", "start")
        .style("font-size", `${timelineStyle.fontItem}`)
        .attr("font-weight", "light")
        .style("fill", `${timelineStyle.defaultItem}`)
        .on("click", function (event, d) {
            const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
            console.log("Data for the clicked year", yearData);
            const hostCountries = yearData.summits.map((summit) => summit.country);
            console.log("Host country clicked", hostCountries);
            highlightClickedItem(svg, geojsonData, d, cumulativeSummits, summitsByCountryMap);
            //borderClickedCountry(svg, hostCountries, countriesWithSummits);
            updateMapByYear(geojsonData, yearData, cumulativeSummits, summitsByCountryMap);
        })
        .each(function (d, i) {
            //console.log('Country text group', d)
            const textElement = d3.select(this);
            //console.log('Summits in country text group', d.summits)
            if (d.summits.length > 0) {
                textElement.selectAll("tspan").remove(); // Clear old tspans
                d.summits.forEach((summit, index) => {
                    let countryName = summit.country;
                    //console.log('country name in draw timeline', countryName)
                    if (countryName === "England") {
                        countryName = "United Kingdom";
                    }
                    const tspan = textElement
                        .append("tspan")
                        .attr("x", containerWidth / timelineHorizontalAlign + timelineStyle.marginYearLeft) // Align tspans with country text
                        .attr("dy", index === 0 ? 0 : `1.2em`) // Adjust vertical spacing
                        .text(countryName);

                    // Add margin bottom after the last country
                    if (index === d.summits.length - 1) {
                        tspan.classed("last-country", true);
                    }
                });
            }
        });
    countryTextGroup.exit().remove(); // Remove any excess country labels
    //console.log('Displayed year in timeline util', displayedYears)
    // Bind the line data and render connecting vertical lines between circles
    const lineGroup = svg.selectAll("line").data(displayedYears.slice(1));
    lineGroup
        .enter()
        .append("line")
        .merge(lineGroup)
        .attr("x1", containerWidth / timelineHorizontalAlign)
        .attr("y1", (d, i) => circleSpacing * (i + 1) + 10 - circleSpacing / 3) // Start from below the previous circle
        .attr("x2", containerWidth / timelineHorizontalAlign)
        .attr("y2", (d, i) => circleSpacing * (i + 2) - 10 - circleSpacing / 3) // End above the next circle
        .attr("stroke", `${timelineStyle.arrowLineColor}`)
        .attr("stroke-width", 2);
    lineGroup.exit().remove(); // Remove any excess lines
}

export function highlightItem(svg, summitData, highlightIndex, currentYearIndex) {
    const displayedYears = summitData.slice(currentYearIndex,currentYearIndex + maxYearsToShow); // Get the current set of years
    // Reset the style of all circles and texts to default (gray)
    svg.selectAll("circle").attr("fill", `${timelineStyle.defaultItem}`);
    svg.selectAll("text.year").style("fill", `${timelineStyle.defaultItem}`);
    svg.selectAll("text.country").style("fill", `${timelineStyle.defaultItem}`);

    const currentYearData = displayedYears[highlightIndex]; // Get the current year data using the index
    console.log('Displayed years in highlightItem function', displayedYears);
    //console.log('Highlighting the Year:', currentYearData.year)
    if (
        currentYearData ||
        (currentYearData && currentYearData.year <= displayedYears[-1].year)
    ) {
        // If the data of the current year is less or equal than last obs of displayed years array
        // If currentYearData exists, filter the circles based on the current year
        console.log('Highlighting the Year:', currentYearData.year)

       
        const circles = svg
            .selectAll("circle")
            .filter((d) => d.year === currentYearData.year);
        const textYear = svg
            .selectAll("text.year")
            .filter((d) => d.year === currentYearData.year);
        const countries = svg
            .selectAll("text.country")
            .filter((d) => d.year === currentYearData.year);
        console.log('Circles:', circles, 'TextYear:', textYear, 'Countries:', countries);

        circles.attr("r", 10).attr("fill", timelineStyle.highlightItem); // Highlighted circle
        textYear.style("fill", timelineStyle.highlightItem);
        countries.style("fill", timelineStyle.highlightItem);

        circles.raise();
    }
}

export function highlightClickedItem(svg, geojsonData, clickedData, cumulativeSummits, summitsByCountryMap) {
    console.log('Clicked data in highlightClickedItem function', clickedData)
    svg.selectAll("circle").attr("fill", `${timelineStyle.notActiveNode}`).attr("r", 5); // Reset all circles
    svg
        .selectAll("text.year")
        .style("fill", `${timelineStyle.notActiveNode}`)
        .style("font-weight", "normal"); // Reset year text
    svg
        .selectAll("text.country")
        .style("fill", `${timelineStyle.notActiveNode}`)
        .style("font-weight", "normal"); // Reset country text
    // Highlight the clicked item
    const circles = svg
        .selectAll("circle")
        .filter((d) => d.year === clickedData.year);
    const textYear = svg
        .selectAll("text.year")
        .filter((d) => d.year === clickedData.year);
    const countries = svg
        .selectAll("text.country")
        .filter((d) => d.year === clickedData.year);

    circles
        .attr("r", 10)
        .attr("fill", `${timelineStyle.activeNode}`)
    //.attr("stroke", timelineStyle.borderItem) // Set stroke color
    //.attr("stroke-width", timelineStyle.borderWidthItem);
    textYear
        .style("font-weight", "bold")
        .style("fill", `${timelineStyle.activeNode}`); // Highlight year text
    countries
        //.style("font-weight", "bold")
        .style("fill", `${timelineStyle.activeNode}`); // Highlight country text

    circles.raise(); // Bring the clicked circle to the front
    updateMapByYear(geojsonData, clickedData, cumulativeSummits, summitsByCountryMap);
    displaySummitsYear(clickedData);
}

export function initMobileTimelineSVG() {
    const svg = d3
        .select("#mobile-timeline")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    return svg;
}
export function mobileTimeline(svg, summitData, currentYearIndex) {
    const circleSpacing = 0;
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + 1);
    const yearTextGroup = svg
        .selectAll("text.year")
        .data(displayedYears, (d) => d.year);
    yearTextGroup
        .enter()
        .append("text")
        .attr("class", "year")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => (i === 0 ? "" : "gray"))
        .text((d) => d.year)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            const clickedYear = d.year; // Get the year that was clicked
            const yearData = summitData.find((summit) => summit.year === clickedYear); // Get data for clicked year
            const hostCountries =
                yearData.summits.length > 0
                    ? yearData.summits.map((summit) => summit.country)
                    : [];
            borderClickedCountry(svg, hostCountries);
        });
    yearTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => (i === 0 ? "black" : "gray"))
        .text((d) => d.year);
    yearTextGroup.exit().remove();

    // Create or update country labels (below the year)
    const countryTextGroup = svg
        .selectAll("text.country")
        .data(displayedYears, (d) => d.year);
    countryTextGroup
        .enter()
        .append("text")
        .attr("class", "country")
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100) // Position slightly below the year text
        .attr("text-anchor", "middle")
        .style("fill", "gray")
        .each(function (d, i) {
            const textElement = d3.select(this);
            if (d.summits.length > 0) {
                // For each country, append a new tspan to position it vertically
                d.summits.forEach((summit, index) => {
                    textElement
                        .append("tspan")
                        .attr("x", circleSpacing * (i + 1)) // Keep x the same for alignment
                        .attr("dy", index === 0 ? 0 : "1.2em") // Add vertical space for each tspan
                        .text(summit.country);
                });
            }
        })
        .style("cursor", "pointer") // Add cursor pointer style
        .on("click", function (event, d) {
            const clickedYear = d.year; // Get the year that was clicked
            const yearData = summitData.find((summit) => summit.year === clickedYear); // Get data for clicked year
            const hostCountries =
                yearData.summits.length > 0
                    ? yearData.summits.map((summit) => summit.country)
                    : [];
            borderClickedCountry(svg, hostCountries);
        });
    countryTextGroup
        .attr("x", (d, i) => circleSpacing * (i + 1))
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("fill", (d, i) => (i === 0 ? "black" : "gray"))
        .text((d) => (d.summits.length > 0 ? d.summits[0].country : "")); // Update host country
    countryTextGroup.exit().remove();
}
