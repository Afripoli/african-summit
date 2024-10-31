import {
  updateMap,
  borderClickedCountry,
  updateMapByYear,
} from "./mapUtils.js";
import { maxYearsToShow, timelineStyle } from "./globals.js";

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
  displayedYears,
  countriesWithSummits,
  cumulativeSummits
) {
  console.log("Passing summit data in generateTimeline function", summitData);
  drawTimeline(
    svg,
    geojsonData,
    summitData,
    displayedYears,
    countriesWithSummits,
    cumulativeSummits
  );
}

export function appendUpArrow() {
  const containerHeight =
    document.getElementById("desktop-timeline").offsetHeight;
  const containerWidth =
    document.getElementById("desktop-timeline").offsetWidth;
  const upArrowDiv = document.createElement("div");
  upArrowDiv.classList.add("arrow-container", "up-arrow");
  upArrowDiv.innerHTML = '<i class="fas fa-chevron-up"></i>';
  upArrowDiv.style.textAlign = "center";
  upArrowDiv.style.position = "absolute";
  document.getElementById("desktop-timeline").appendChild(upArrowDiv);
}

export function appendDownArrow(svg, summitData, currentYearIndex) {
  const containerHeight =
    document.getElementById("desktop-timeline").offsetHeight;
  const containerWidth =
    document.getElementById("desktop-timeline").offsetWidth;
  const downArrowDiv = document.createElement("div");
  downArrowDiv.classList.add("arrow-container", "down-arrow");
  downArrowDiv.innerHTML = '<i class="fas fa-chevron-down"></i>';
  downArrowDiv.style.position = "absolute";
  downArrowDiv.style.textAlign = "center";
  document.getElementById("desktop-timeline").appendChild(downArrowDiv);
}

export function drawTimeline(
  svg,
  geojsonData,
  summitData,
  displayedYears,
  countriesWithSummits,
  cumulativeSummits
) {
  console.log("Passing summit data in drawtimeline function", summitData);
  console.log(
    "Set countries with summits in drawtimeline function",
    countriesWithSummits
  );
  console.log(
    "Passing parameter cummulativeSummits in drawtimeline function",
    cumulativeSummits
  );
  //console.log('Current year index input Timeline UP', currentYearIndex)
  const containerHeight =
    document.getElementById("desktop-timeline").offsetHeight;
  const containerWidth =
    document.getElementById("desktop-timeline").offsetWidth;
  //const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the current set of years
  //console.log('Drawing years: ', displayedYears)
  const circleSpacing = containerHeight / (maxYearsToShow + 1);
  const circleGroup = svg
    .selectAll("circle")
    .data(displayedYears, (d) => d.year);
  circleGroup
    .enter()
    .append("circle")
    .merge(circleGroup)
    .attr("cx", containerWidth / 3) // Keep the circles centered horizontally
    .attr("cy", (d, i) => circleSpacing * (i + 1) - circleSpacing / 3) // Adjust to start first circle at top
    .attr("r", (d, i) => (i === 0 ? 10 : 5)) // Make the first circle bigger
    .attr("fill", `${timelineStyle.defaultItem}`)
    .style("cursor", "pointer")
    .on("click", function (event, d) {
      const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
      console.log("Data for the clicked year", yearData);
      const hostCountries = yearData.summits.map((summit) => summit.country);
      console.log("Host country clicked", hostCountries);
      highlightClickedItem(svg, d);
      //borderClickedCountry(svg, hostCountries, countriesWithSummits);
      updateMapByYear(geojsonData, yearData, cumulativeSummits);
    });

  circleGroup.exit().remove(); // Remove any excess circles

  // Bind the year label data and render year labels next to the circles
  const yearTextGroup = svg
    .selectAll("text.year")
    .data(displayedYears, (d) => d.year);
  yearTextGroup
    .enter()
    .append("text")
    .attr("class", "year")
    .merge(yearTextGroup)
    .attr("x", containerWidth / 3 + 10) // Position the label to the right of the circle
    .attr("y", (d, i) => circleSpacing * (i + 1) + 5 - circleSpacing / 3) // Align with the circle vertically
    .attr("text-anchor", "start")
    .text((d) => d.year)
    .style("cursor", "pointer")
    .style("font-size", `${timelineStyle.fontItem}`)
    .on("click", function (event, d) {
      console.log("Summit data in timeline util", summitData);
      const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
      console.log("Data for the clicked year", yearData);
      const hostCountries = yearData.summits.map((summit) => summit.country);
      console.log("Host country clicked", hostCountries);
      highlightClickedItem(svg, d);
      //borderClickedCountry(svg, hostCountries, countriesWithSummits);
      updateMapByYear(geojsonData, yearData, cumulativeSummits);
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
    .attr("x", containerWidth / 3 + 1) // Position the country label to the right of the year label
    .attr("y", (d, i) => circleSpacing * (i + 1) + 25 - circleSpacing / 3) // Align with the year label
    .attr("text-anchor", "start")
    .style("font-size", `${timelineStyle.fontItem}`)
    .style("fill", `${timelineStyle.defaultItem}`)  
    .on("click", function (event, d) {
      const yearData = summitData.find((summit) => summit.year === d.year); // Get data for clicked year
      console.log("Data for the clicked year", yearData);
      const hostCountries = yearData.summits.map((summit) => summit.country);
      console.log("Host country clicked", hostCountries);
      highlightClickedItem(svg, d);
      //borderClickedCountry(svg, hostCountries, countriesWithSummits);
      updateMapByYear(geojsonData, yearData, cumulativeSummits);
    })
    .each(function (d, i) {
        console.log('Country text group', d)
      const textElement = d3.select(this);
      console.log('Summits in country text group', d.summits)
      if (d.summits.length > 0) {
        textElement.selectAll("tspan").remove(); // Clear old tspans
        d.summits.forEach((summit, index) => {
          textElement
            .append("tspan")
            .attr("x", containerWidth / 3 + 10) // Align tspans with country text
            .attr("dy", index === 0 ? 0 : "1.2em") // Adjust vertical spacing
            .text(summit.country);
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
    .attr("x1", containerWidth / 3)
    .attr("y1", (d, i) => circleSpacing * (i + 1) + 10 - circleSpacing / 3) // Start from below the previous circle
    .attr("x2", containerWidth / 3)
    .attr("y2", (d, i) => circleSpacing * (i + 2) - 10 - circleSpacing / 3) // End above the next circle
    .attr("stroke", "gray")
    .attr("stroke-width", 2);
  lineGroup.exit().remove(); // Remove any excess lines
  // Update button visibility based on the current index
  //d3.select(".up-button").style("visibility", currentYearIndex === 0 ? "hidden" : "visible");
  //d3.select(".down-button").style("visibility", currentYearIndex + maxYearsToShow >= summitData.length ? "hidden" : "visible");
}

export function highlightItem(
  svg,
  summitData,
  highlightIndex,
  currentYearIndex
) {
  const displayedYears = summitData.slice(
    currentYearIndex,
    currentYearIndex + maxYearsToShow
  ); // Get the current set of years
  // console.log('Input years for HighlightItem function', displayedYears)
  // Reset the style of all circles and texts to default (gray)
  svg.selectAll("circle").attr("fill", `${timelineStyle.defaultItem}`);
  svg.selectAll("text.year").style("fill", `${timelineStyle.defaultItem}`);
  svg.selectAll("text.country").style("fill", `${timelineStyle.defaultItem}`);

  const currentYearData = displayedYears[highlightIndex]; // Get the current year data using the index
  //console.log('Highlighting the Year:', currentYearData.year)
  if (
    currentYearData ||
    (currentYearData && currentYearData.year <= displayedYears[-1].year)
  ) {
    // If the data of the current year is less or equal than last obs of displayed years array
    // If currentYearData exists, filter the circles based on the current year
    const circles = svg
      .selectAll("circle")
      .filter((d) => d.year === currentYearData.year);
    const textYear = svg
      .selectAll("text.year")
      .filter((d) => d.year === currentYearData.year);
    const countries = svg
      .selectAll("text.country")
      .filter((d) => d.year === currentYearData.year);
    //console.log('Circles:', circles, 'TextYear:', textYear, 'Countries:', countries);

    circles.attr("r", 10).attr("fill", timelineStyle.highlightItem); // Highlighted circle
    textYear.style("fill", timelineStyle.highlightItem);
    countries.style("fill", timelineStyle.highlightItem);
  }
}

export function highlightClickedItem(svg, clickedData) {
  svg.selectAll("circle").attr("fill", timelineStyle.defaultItem).attr("r", 5); // Reset all circles
  svg
    .selectAll("text.year")
    .style("fill", timelineStyle.defaultItem)
    .style("font-weight", "normal"); // Reset year text
  svg
    .selectAll("text.country")
    .style("fill", timelineStyle.defaultItem)
    .style("font-weight", "normal"); // Reset country text
  //console.log('Clicked data is', clickedData)
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
    .attr("fill", timelineStyle.clickedYearCountry)
    .attr("stroke", timelineStyle.borderItem) // Set stroke color
    .attr("stroke-width", timelineStyle.borderWidthItem);
  textYear
    .style("font-weight", "bold")
    .style("fill", timelineStyle.clickedYearCountry); // Highlight year text
  countries
    .style("font-weight", "bold")
    .style("fill", timelineStyle.clickedYearCountry); // Highlight country text
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
