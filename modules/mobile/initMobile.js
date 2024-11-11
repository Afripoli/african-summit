// import { initMobileTimelineSVG /*, mobileTimeline*/ } from '../mobile/timelineUtilsMobile.js';
// import { drawMap } from "../desktop/mapUtils.js";

import { displaySummitsYear } from "../desktop/summitUtils.js";

export function initMobileTimeline(/*geojsonData, summitMap, */ jsonData /*summitsByCountryMap, summitCounter*/) {
    //const svg = initMobileTimelineSVG();
    console.log('JSON data in mobile timeline', jsonData);
    //let currentYearIndex = 0;
    //let highlightIndex = 0;
    //drawMap(geojsonData);
    const instance = mobiscroll.select('#select-year', {
        inputElement: document.getElementById('select-year'),
        controls: ['year'],
        touchUi: true,
        showOnClick: true,
        //showOnFocus: false,
        onChange: function (event, inst) {
            console.log('Instance', inst.getVal())
            console.log('Event', event)
            const selectedYear = inst.getVal();
            console.log('Selected year:', selectedYear);
            // Update the input field with the selected year
            document.getElementById('button-picker').value = selectedYear;
            // Update the visualization based on the selected year
            const yearData = jsonData.find((summit) => summit.year === parseInt(selectedYear));
            //updateMapByYear(geojsonData, yearData, summitMap, summitsByCountryMap, currentZoomScale);
            if (yearData) {
                displaySummitsYear(yearData);
            }        }
    });
    mobiscroll.getJson('/db/summits-by-year.json', function (data) {
        let summitYears = [];
        for (let i = 0; i < data.length; ++i) {
            let summit = data[i];
            summitYears.push( { text: `${summit.year}`, value: summit.year } )
        }
        instance.setOptions({ data: summitYears })
        console.log('Summit years:', summitYears);
    });
    // document.getElementById('select-year').addEventListener('click', function () {
    //     console.log('Select year button clicked'); // Add this line to log the button click event
    //     instance.open();
    //     return false;
    // })
}