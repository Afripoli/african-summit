// import { initMobileTimelineSVG /*, mobileTimeline*/ } from '../mobile/timelineUtilsMobile.js';
// import { drawMap } from "../desktop/mapUtils.js";

import { getSummitsforCountry, displaySummitsCountry, displaySummitsYear } from "../desktop/summitUtils.js";
import { initializeMobileMap, updateMapByCountry, updateMapByYear } from "./mapMobile.js";

export function initMobileTimeline(geojsonData, jsonData, cumulativeSummits, summitsByCountryMap /*, summitCounter*/) {
    console.log('JSON data in mobile timeline', jsonData);
    console.log('Summits by country map', summitsByCountryMap)

    initializeMobileMap(geojsonData /*, yearData, cumulativeSummits, summitsByCountryMap*/);

    // Initialize the year picker
    const yearInstance = mobiscroll.select('#select-year', {
        inputElement: document.getElementById('select-year'),
        controls: ['year'],
        touchUi: true,
        showOnClick: true,
        themeVariant: 'light',
        //showOnFocus: false,
        onChange: function (event, inst) {
            const selectedYear = inst.getVal();
            console.log('Selected year:', selectedYear);
            // Update the input field with the selected year
            document.getElementById('button-picker').value = selectedYear;
            // Update the visualization based on the selected year
            const yearData = jsonData.find((summit) => summit.year === parseInt(selectedYear));
            if (yearData) {
                console.log('Year data:', yearData);
                displaySummitsYear(yearData);
                updateMapByYear(d3.select("#map-mobile svg"), geojsonData, yearData, cumulativeSummits, summitsByCountryMap);
                //initializeMobileMap(geojsonData, yearData, cumulativeSummits, summitsByCountryMap);
            }
        }
    });
    // Initialize Mobiscroll country picker
    const countryInstance = mobiscroll.select('#select-country', {
        inputElement: document.getElementById('select-country'),
        controls: ['select'],
        touchUi: true,
        showOnClick: false,
        onChange: function (event, inst) {
            const selectedCountry = inst.getVal(); // Get the selected country
            console.log('Selected country:', selectedCountry); // Log the selected country
            // Update the visualization based on the selected country
            if (selectedCountry) {
                let summits = getSummitsforCountry(summitsByCountryMap, selectedCountry);
                displaySummitsCountry(selectedCountry, summits);
                // Update the map based on the selected country
                updateMapByCountry(d3.select("#map-mobile svg"), geojsonData, selectedCountry);
            }
        }
    });

    // Fetch summit years data and populate Mobiscroll
    mobiscroll.getJson('/db/summits-by-year.json', function (data) {
        let summitYears = [];
        for (let i = 0; i < data.length; ++i) {
            let summit = data[i];
            summitYears.push({ text: `${summit.year}`, value: summit.year })
        }
        yearInstance.setOptions({ data: summitYears })
        console.log('Summit years:', summitYears);
    });
    // Fetch countries data and populate Mobiscroll
    let countries = [];
    summitsByCountryMap.forEach((value, key) => {
        console.log('Key is ', key, 'value is ', value);
        countries.push({ text: key, value: key });
    });
    countryInstance.setOptions({ data: countries });
    console.log('Countries:', countries); // Log the countries

    // Set up event listener to open the country picker
    document.getElementById('select-country').addEventListener('click', function () {
        console.log('Select country button clicked'); // Log the button click event
        countryInstance.open();
        return false;
    });
}