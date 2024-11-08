import {
  svg,
  center,
  scale,
  translation,
  hostCountry,
  mapStyle,
  countryOffsets
} from "../common/globals.js";
import { getSummitsforCountry, displaySummitsCountry } from "./summitUtils.js";

let projection = d3
  .geoMercator()
  .center(center)
  .scale(scale)
  .translate(translation);
let path = d3.geoPath().projection(projection);

// Define a global variable for the current zoom scale
let currentZoomScale = 1;
// Define zoom behavior
const zoom = d3.zoom()
  .scaleExtent([1, 8]) // Set the scale extent for zooming
  .on("zoom", zoomed);

// Apply zoom behavior to the SVG
//svg.call(zoom);

function zoomed(event) {
  currentZoomScale = event.transform.k; // Update the global zoom scale
  svg.selectAll("path").attr("transform", event.transform);
  svg.selectAll(".country-label")
    .attr("transform", event.transform)
    .style("font-size", function () {
      //let scale = event.transform.k;
      console.log('Scale in zoomed', currentZoomScale)
      return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
    });
}

export function drawMap(geojson) {
  //console.log('geojson', geojson)
  const paths = svg
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", mapStyle.defaultFill)
    .attr("stroke", mapStyle.defaultBorder)
    .attr("stroke-width", mapStyle.defaultBorderWidth);

  // Create and append buttons in a separate container
  const buttonContainer = svg.append("g").attr("class", "button-container");

  const buttons = [
    { id: "zoomInButton", text: "+", x: 20, y: 20 },
    { id: "zoomOutButton", text: "-", x: 20, y: 40 },
  ];
  buttons.forEach(button => {
    buttonContainer
      .append("rect")
      .attr("id", button.id)
      .attr("x", button.x)
      .attr("y", button.y)
      .attr("width", 20)
      .attr("height", 20)
      .attr("rx", 7) // Rounded corners
      .attr("ry", 7) // Rounded corners
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => handleButtonClick(svg, button.id));

    buttonContainer
      .append("text")
      .attr("class", "button-text")
      .attr("x", button.x + 10)
      .attr("y", button.y + 10)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "16px")
      .style("fill", "#000")
      .text(button.text)
      .style("pointer-events", "none");

    console.log('Button text is', button.text);
  });
  // Apply zoom behavior to the SVG
  svg.call(zoom);
}

function handleButtonClick(svg, buttonId) {
  console.log(`Button ${buttonId} clicked`);

  // Add your button click handling logic here
  switch (buttonId) {
    case 'zoomInButton':
      // Logic for Zoom In
      svg.transition().call(zoom.scaleBy, 2); // Zoom in by a factor of 1.2
      break;
    case 'zoomOutButton':
      // Logic for Zoom Out
      svg.transition().call(zoom.scaleBy, 0.5); // Zoom out by a factor of 0.8
      break;
    default:
      console.log(`No handler for button ${buttonId}`);
  }
}

function updateSummitCounter(summitMap, currentYear, summitCounter) {
  //console.log('Summit map has current year', summitMap)
  summitMap[currentYear].forEach((country) => {
    console.log("Country in summit map", country);
    summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
  });
}

function drawCountryISO(svg, geojsonData, summitCounter) {
  console.log('Summit counter in drawCountryISO', summitCounter)
  svg.selectAll(".country-label").remove(); // Remove existing labels
  svg.selectAll(".country-label")
    .data(geojsonData.features)
    .enter()
    .append("text")
    .attr("class", "country-label")
    .attr("x", d => {
      const countryName = d.properties.name;
      return (countryOffsets[countryName]?.x || 0) + path.centroid(d)[0];
    })
    .attr("y", d => {
      const countryName = d.properties.name;
      return (countryOffsets[countryName]?.y || 0) + path.centroid(d)[1];
    })
    .text(d => {
      const countryName = d.properties.name;
      const count = summitCounter.has(countryName)
        ? summitCounter.get(countryName)
        : undefined;
      if (count !== undefined) {
        const iso = d.id || ""; // Get ISO abbreviation
        return `${iso}: ${count}`; // Format text as "ISO: count"
      } else {
        return ""; // Return empty string if not in summitCounter
      }
    })
    .attr("text-anchor", `${mapStyle.textAnchor}`)
    .attr("alignment-baseline", `${mapStyle.alignmentBaseline}`)
    .attr("font-size", `${mapStyle.fontSize}`)
    .attr("font-weight", `${mapStyle.fontWeight}`)
    .style("fill", "black");
}
export function updateMap(
  geojsonData,
  summitMap,
  currentYear,
  summitsByCountryMap,
  hostCountry,
  summitCounter
) {
  clearCountryLabels();
  updateSummitCounter(summitMap, currentYear, summitCounter);
  summitMap[currentYear].forEach((country) => {
    hostCountry.push(country);
    colorHostCountry(svg, hostCountry);
  });
  console.log('Summits by country map', summitsByCountryMap)
  svg
    .selectAll("path")
    .data(geojsonData.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {
      const country = d.properties.name;
      return summitCounter.has(country)
        ? mapStyle.fillHost
        : mapStyle.defaultFill; // Fill orange if present in the map, else white
    })
    .style("cursor", "pointer")
    .on("click", function (event, d) {
      //console.log('Country on click', d.properties.name)
      const country = d.properties.name;
      const summits = getSummitsforCountry(summitsByCountryMap, country);
      displaySummitsCountry(country, summits); // Call function to display the summits
    });
  drawCountryISO(svg, geojsonData, summitCounter)
}

// select host country
function colorHostCountry(svg, hostCountry) {
  console.log("Coloring host country", hostCountry);
  svg
    .selectAll("path")
    .attr("fill", (d) =>
      hostCountry.includes(d.properties.name)
        ? mapStyle.borderHost
        : mapStyle.defaultFill
    )
    .style("cursor", (d) =>
      hostCountry.includes(d.properties.name) ? "pointer" : "default"
    ) // Change cursor for host countries
    .transition()
    .duration(500);
}

export function borderClickedCountry(svg, hostCountries, countriesWithSummits) {
  console.log(
    "Set countries with summits in borderHostCountry",
    countriesWithSummits
  );
  console.log("Bordering host countries", hostCountries);
  d3.selectAll("path").each(function (d) {
    if (countriesWithSummits.has(d.properties.name)) {
      d3.select(this)
        .attr("fill", mapStyle.fillHost) // Reset to yellow for countries with summits
        .attr("stroke", mapStyle.defaultBorder)
        .attr("stroke-width", mapStyle.defaultBorderWidth);
    }
  });
  d3.selectAll("path").each(function (d) {
    if (hostCountries.includes(d.properties.name)) {
      d3.select(this).attr("fill", mapStyle.clickedYearCountry); // Set to orange for host countries
    }
  });
}

// Function to clear existing labels
export function clearCountryLabels() {
  svg.selectAll(".country-label").remove();
  svg.selectAll(".country-counter").remove();
}

export function updateMapByYear(geojsonData, year, cumulativeSummits, summitsByCountryMap) {
  console.log("Year in updateMapByYear", year);
  console.log(
    "Passing cumulative summits in updateMapByYear",
    cumulativeSummits
  );
  clearCountryLabels();
  const yearData = cumulativeSummits.get(year.year);
  console.log("Year data in updateMapByYear", yearData);
  console.log("Summits by country map in updateMapByYear", summitsByCountryMap);
  const cumulative = yearData.cumulative;
  const newCountries = yearData.new;

  // Color the countries
  svg
    .selectAll("path")
    .data(geojsonData.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {
      const country = d.properties.name;
      if (newCountries.has(country)) {
        return `${mapStyle.clickedYearCountry}`; // Brown color for new countries
      } else if (cumulative.has(country)) {
        return `${mapStyle.fillHost}`; // Yellow color for cumulative countries
      } else {
        return `${mapStyle.defaultFill}`; // Default color for other countries
      }
    })
    .style("cursor", "pointer")
    .on("click", function (event, d) {
      const country = d.properties.name;
      const summits = getSummitsforCountry(summitsByCountryMap, country);
      displaySummitsCountry(country, summits); // Call function to display the summits
    });
  // Add or update summit count text inside countries
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
  // Apply zoom transformation to newly added labels
  //const currentTransform = d3.zoomTransform(svg.node());
  console.log('Current zoom scale in updateMapByYear', currentZoomScale)
  svg.selectAll(".country-label")
  .attr("transform", d3.zoomTransform(svg.node()))
  .style("font-size", function() {
    return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
  });
  // Ensure button text is not removed
  svg.selectAll(".button-text").raise();

  svg.call(zoom);

}
