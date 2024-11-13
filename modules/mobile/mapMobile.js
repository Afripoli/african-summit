import {
    svg,
    center,
    scale,
    translation,
    mapStyle,
    countryOffsets
  } from "../common/globals.js";
  import { getSummitsforCountry, displaySummitsCountry } from "../desktop/summitUtils.js";

  let projection = d3.geoMercator().center([0, 0]).scale(100).translate([125, 175]); // do not move coord unless svg size is changed!
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
        return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
      });
  }
  
  export function initializeMobileMap(geojsonData /*, year, cumulativeSummits, summitsByCountryMap*/) {
    // Create the SVG element for the map
    const width = document.getElementById('map-mobile').clientWidth;
    //const height = document.getElementById('map-mobile').clientHeight;
    const height = 300;

    const svg = d3.select("#map-mobile").append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Draw the map
    drawMap(svg, geojsonData);
  
    // Add zoom buttons
    addZoomButtons(svg);
  
    // Update the map based on the selected year
    // updateMapByYear(svg, geojsonData, year, cumulativeSummits, summitsByCountryMap);

    // Make the map responsive
    window.addEventListener('resize', () => resizeMap(svg, geojsonData));    
}
  
  function drawMap(svg, geojsonData) {
    const paths = svg
      .selectAll("path")
      .data(geojsonData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", mapStyle.defaultFill)
      .attr("stroke", mapStyle.defaultBorder)
      .attr("stroke-width", mapStyle.defaultBorderWidth);
  
    // Apply zoom behavior to the SVG
    svg.call(zoom);
  }
  
  function addZoomButtons(svg) {
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
    });
  }
  
  function handleButtonClick(svg, buttonId) {
    console.log(`Button ${buttonId} clicked`);
  
    // Add your button click handling logic here
    switch (buttonId) {
      case 'zoomInButton':
        // Logic for Zoom In
        svg.transition().call(zoom.scaleBy, 2); // Zoom in by a factor of 2
        break;
      case 'zoomOutButton':
        // Logic for Zoom Out
        svg.transition().call(zoom.scaleBy, 0.5); // Zoom out by a factor of 0.5
        break;
      default:
        console.log(`No handler for button ${buttonId}`);
    }
  }
  
  export function updateMapByYear(geojsonData, year, cumulativeSummits, summitsByCountryMap) {
    console.log("Year in updateMapByYear", year);
    console.log("Passing cumulative summits in updateMapByYear", cumulativeSummits);
    clearCountryLabels(svg);
    const yearData = cumulativeSummits.get(year.year);
    console.log("Year data in updateMapByYear", yearData);
    console.log("Summits by country map in updateMapByYear", summitsByCountryMap);
    const cumulative = yearData.cumulative;
    console.log('Cumulative summits in updateMapByYear', yearData.cumulative);
    const newCountries = yearData.new;
  
    console.log('New countries', newCountries)
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
        } 
        else {
          return `${mapStyle.defaultFill}`; // Default color for other countries
        }
      })
    // Add or update summit count text inside countries
    /*
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
      */
  
    // Apply zoom transformation to newly added labels
    console.log('Current zoom scale in updateMapByYear', currentZoomScale)
    // svg.selectAll(".country-label")
    //   .attr("transform", d3.zoomTransform(svg.node()))
    //   .style("font-size", function() {
    //     return `${mapStyle.fontSize / currentZoomScale}px`; // Adjust font size based on zoom scale
    //   });
  
    // Ensure button text is not removed
    svg.selectAll(".button-text").raise();
  
    svg.call(zoom);
  }
  
  // Function to clear existing labels
  function clearCountryLabels() {
    svg.selectAll(".country-label").remove();
    svg.selectAll(".country-counter").remove();
  }

  // Function to resize the map
function resizeMap(svg, geojsonData) {
    const width = document.getElementById('map-mobile').clientWidth;
    const height = document.getElementById('map-mobile').clientHeight;
    console.log('Resizing map to width:', width, 'height:', height);
    svg.attr("width", width).attr("height", height);

    // Redraw the map with the updated dimensions
    drawMap(svg, geojsonData);
}

export function updateMapByCountry(svg, geojsonData, selectedCountry) {
    console.log("Selected country in updateMapByCountry", selectedCountry);

    // Color the selected country
    svg.selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
            const country = d.properties.name;
            return country === selectedCountry ? `${mapStyle.clickedYearCountry}` : `${mapStyle.defaultFill}`; // Red color for selected country, default color for others
        })
        //.style("cursor", "pointer")
        // .on("click", function (event, d) {
        //     const country = d.properties.name;
        //     const summits = getSummitsforCountry(summitsByCountryMap, country);
        //     displaySummitsCountry(country, summits); // Call function to display the summits
        // });

    // Ensure button text is not removed
    svg.selectAll(".button-text").raise();

    //svg.call(zoom);
}