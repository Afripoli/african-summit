// import { initMobileTimelineSVG /*, mobileTimeline*/ } from '../mobile/timelineUtilsMobile.js';
// import { drawMap } from "../desktop/mapUtils.js";

import { getSummitsforCountry, displaySummitsCountry, displaySummitsYear } from "../desktop/summitUtils.js";

export function initMobileTimeline(/*geojsonData, summitMap, */ jsonData, summitsByCountryMap /*, summitCounter*/) {
    console.log('JSON data in mobile timeline', jsonData);

    // Initialize the year picker
    const yearInstance = mobiscroll.select('#select-year', {
        inputElement: document.getElementById('select-year'),
        controls: ['year'],
        touchUi: true,
        showOnClick: true,
        //showOnFocus: false,
        onChange: function (event, inst) {
            const selectedYear = inst.getVal();
            console.log('Selected year:', selectedYear);
            // Update the input field with the selected year
            document.getElementById('button-picker').value = selectedYear;
            // Update the visualization based on the selected year
            const yearData = jsonData.find((summit) => summit.year === parseInt(selectedYear));
            //updateMapByYear(geojsonData, yearData, summitMap, summitsByCountryMap, currentZoomScale);
            if (yearData) {
                displaySummitsYear(yearData);
            }
        }
    });
    // Initialize Mobiscroll country picker
    const countryInstance = mobiscroll.select('#select-country', {
        inputElement: document.getElementById('select-country'),
        //controls: ['select'],
        touchUi: true,
        showOnClick: false,
        onChange: function (event, inst) {
            const selectedCountry = inst.getVal(); // Get the selected country
            console.log('Selected country:', selectedCountry); // Log the selected country
            // Update the visualization based on the selected country
            let summits = getSummitsforCountry(summitsByCountryMap, selectedCountry);
            displaySummitsCountry(selectedCountry, summits);
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