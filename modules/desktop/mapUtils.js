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
// Define a global variable to store the clicked country
let clickedCountry = null;
// Define zoom behavior
let zoom = d3.zoom()
  .scaleExtent([1, 10]) // Set the scale extent for zooming
  .on("zoom", zoomed);
// Create a group element to contain the map paths and labels
let g;
//g = svg.append("g");
// Apply zoom behavior to the SVG
//svg.call(zoom);

function zoomed(event) {
  //g = svg.append("g");
  //console.log('SVG container', svg)
  //currentZoomScale = event.transform.k; // Update the global zoom scale
  //console.log('Current zoom scale in zoomed', currentZoomScale);
  //console.log('Zoomed event', event)
  //g.selectAll("path").attr("transform", event.transform);
  const { transform } = event;

  g.attr("transform", transform);
  g.selectAll(".country-label, .country-counter")
    .attr("x", function (d) {
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      return `translate(${path.centroid(d)[0] + offset.x})`;
    })
    .attr("y", function (d) {
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      return `translate(${path.centroid(d)[1] + offset.y})`;
    })
    .style("font-size", `${mapStyle.fontSizeNumber / currentZoomScale}px`);
  // Enable drag functionality only when zoomed in
  // if (currentZoomScale > 1) {
  //   svg.call(d3.drag().on("drag", dragged));
  // } else {
  //   svg.on(".drag", null); // Disable drag functionality
  // }
}

// function dragged(event) {
//   console.log('Event in dragged', event)
//   const { dx, dy } = event;
//   const { x, y, k } = d3.zoomTransform(svg.node());
//   //console.log('Coordinates of event', dx, dy, 'Coordinates transformation', x, y, k)
//   g.attr("transform", `translate(${x + dx}, ${y + dy}) scale(${k})`);
// }


export function drawMap(geojson, countriesWithSummits, summitsByCountryMap) {
  //console.log('geojson', geojson)
  g = svg.append("g");

  g.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {
      //console.log('D in drawMap', d)
      const country = d.properties.name;
      return countriesWithSummits.has(country) ? mapStyle.onloadFill : mapStyle.defaultFill;
    })
    .attr("stroke", mapStyle.defaultBorder)
    .attr("stroke-width", mapStyle.defaultBorderWidth)
    .style("cursor", d => countriesWithSummits.has(d.properties.name) ? "pointer" : "default") // Set cursor style
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (countriesWithSummits.has(country)) {
        clickedCountry = country; // Update the clicked country
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
        updateCountryColors(countriesWithSummits);
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })

  g.selectAll(".country-label")
    .data(geojson.features)
    .enter()
    .append("text")
    .attr("class", "country-label")
    .attr("transform", d => {
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      return `translate(${path.centroid(d)[0] + offset.x}, ${path.centroid(d)[1] + offset.y})`;
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${mapStyle.fontSize}px`)
    .style("font-weight", mapStyle.fontWeight)
    .style("cursor", d => countriesWithSummits.has(d.properties.name) ? "pointer" : "default") // Set cursor style for labels
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (countriesWithSummits.has(country)) {
        clickedCountry = country; // Update the clicked country
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
        updateCountryColors(countriesWithSummits);
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })
    .text(d => d.properties.iso_a3); // Country ISO name
  g.selectAll(".country-counter")
    .data(geojson.features)
    .enter()
    .append("text")
    .attr("class", "country-counter")
    .attr("transform", d => {
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      return `translate(${path.centroid(d)[0] + offset.x}, ${path.centroid(d)[1] + offset.y + 15})`; // Adjust the y offset to position below the country name
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${mapStyle.fontSize}px`)
    .style("font-weight", mapStyle.fontWeight)
    .style("cursor", d => countriesWithSummits.has(d.properties.name) ? "pointer" : "default") // Set cursor style for counters
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (countriesWithSummits.has(country)) {
        clickedCountry = country; // Update the clicked country
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
        updateCountryColors(countriesWithSummits);
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })
    .text(d => d.properties.summitCount); // Counter
  // Apply zoom behavior to the SVG
  svg.call(zoom);
  document.getElementById("zoomIn").addEventListener("click", () => handleButtonClick(svg, "zoomInButton"));
  document.getElementById("zoomOut").addEventListener("click", () => handleButtonClick(svg, "zoomOutButton"));
}

function updateCountryColors(countriesWithSummits) {
  g.selectAll("path")
    .attr("fill", d => {
      const country = d.properties.name;
      if (country === clickedCountry) {
        return mapStyle.clickedYearCountry; // Color for clicked country
      } else if (countriesWithSummits.has(country)) {
        return mapStyle.onloadFill; // Color for countries with summits
      } else {
        return mapStyle.defaultFill; // Default color for other countries
      }
    });
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
    //console.log("Country in summit map", country);
    summitCounter.set(country, (summitCounter.get(country) || 0) + 1);
  });
}

function drawCountryISO(geojsonData, summitCounter, countriesWithSummits, summitsByCountryMap) {
  g.selectAll(".country-label").remove(); // Remove existing labels
  g.selectAll(".country-label")
    .data(geojsonData.features)
    .enter()
    .append("text")
    .attr("class", "country-label")
    .attr("transform", d => {  // SOMEWHERE HERE IS THE PROBLEM
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      const transform = `translate(${path.centroid(d)[0] + offset.x}, ${path.centroid(d)[1] + offset.y})`;
      //console.log(`Country: ${d.properties.name}, Transform: ${transform}, Country centroid: ${path.centroid(d)}`);
      return transform;
    })
    .style("cursor", d => countriesWithSummits.has(d.properties.name) ? "pointer" : "default") // Set cursor style for labels
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (countriesWithSummits.has(country)) {
        clickedCountry = country; // Update the clicked country
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
        updateCountryColors(countriesWithSummits);
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })
    .text(d => {
      const iso = d.id || ""; // Get ISO abbreviation
      const count = summitCounter.has(d.properties.name)
        ? summitCounter.get(d.properties.name)
        : undefined;
      if (count !== undefined) {
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
  summitCounter,
  countriesWithSummits
) {
  clearCountryLabels();
  updateSummitCounter(summitMap, currentYear, summitCounter);
  summitMap[currentYear].forEach((country) => {
    hostCountry.push(country);
    colorHostCountry(svg, hostCountry);
  });
  //console.log('Summits by country map', summitsByCountryMap)
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
    .style("cursor", d => countriesWithSummits.has(d.properties.name) ? "pointer" : "default")
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (countriesWithSummits.has(country)) {
        clickedCountry = country; // Update the clicked country
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
        updateCountryColors(countriesWithSummits);
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })
  //drawCountryISO(svg, geojsonData, summitCounter, countriesWithSummits, summitsByCountryMap);
}


// select host country
function colorHostCountry(svg, hostCountry) {
  //console.log("Coloring host country", hostCountry);
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
  clearCountryLabels();
  const yearData = cumulativeSummits.get(year.year);
  console.log("Year data in updateMapByYear", yearData);
  console.log("Summits by country map in updateMapByYear", summitsByCountryMap);
  const cumulative = yearData.cumulative;
  const newCountries = yearData.new;

  // Color the countries
  g.selectAll("path")
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
    .style("cursor", d => cumulative.has(d.properties.name) ? "pointer" : "default") // Set cursor style
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (cumulative.has(country)) {
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }

    });
  // Add or update summit count text inside countries
  g.selectAll(".country-label")
    .data(geojsonData.features)
    .join("text")
    .attr("class", "country-label")
    .attr("transform", d => {  // SOMEWHERE HERE IS THE PROBLEM
      const offset = countryOffsets[d.properties.name] || { x: 0, y: 0 };
      const centroid = path.centroid(d);
      console.log('Centroid for', d.properties.name, ':', centroid);
      let transform = `translate(${path.centroid(d)[0] + offset.x}, ${path.centroid(d)[1] + offset.y})`;
      console.log(`Country: ${d.properties.name}, Transform: ${transform}, Country centroid: ${path.centroid(d)}`);
      return transform;
    })
    .attr("dy", ".25em")
    .attr("text-anchor", `${mapStyle.textAnchor}`)
    .attr("alignment-baseline", `${mapStyle.alignmentBaseline}`)
    .attr("font-size", `${mapStyle.fontSize}`)
    .attr("font-weight", `${mapStyle.fontWeight}`)
    .style("cursor", d => cumulative.has(d.properties.name) ? "pointer" : "default") // Set cursor style for counters
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
    })
    .on("click", function (event, d) {
      const country = d.properties.name;
      if (cumulative.has(country)) {
        const summits = getSummitsforCountry(summitsByCountryMap, country);
        displaySummitsCountry(country, summits); // Call function to display the summits
      } else {
        event.stopPropagation(); // Prevent default behavior for non-clickable countries
      }
    })
  // Apply zoom transformation to newly added labels
  //const currentTransform = d3.zoomTransform(svg.node());
  console.log('Current zoom scale in updateMapByYear', currentZoomScale)
  /*g.selectAll(".country-label")
    .attr("transform", d3.zoomTransform(svg.node()))
    .style("font-size", function () {
      return `${mapStyle.fontSizeNumber / currentZoomScale}px`; // Adjust font size based on zoom scale
    });*/
  // Ensure button text is not removed
  //g.selectAll(".button-text").raise();

  //svg.call(zoom);

}


// ISSUE ON MAP WITH DRAG:
// - INSERT COUNTER IN THE FUNCTION THAT DRAWS THE MAP 