// import { initMobileTimelineSVG /*, mobileTimeline*/ } from '../mobile/timelineUtilsMobile.js';
// import { drawMap } from "../desktop/mapUtils.js";

export function initMobileTimeline(geojsonData, summitMap, jsonData, summitsByCountryMap, summitCounter) {
    //const svg = initMobileTimelineSVG();

    //let currentYearIndex = 0;
    //let highlightIndex = 0;
    //drawMap(geojsonData);
    const instance = mobiscroll.select('#button-picker', {
        inputElement: document.getElementById('button-picker'),
        controls: ['year'],
        touchUi: true,
        showOnClick: false,
        showOnFocus: false,
        onSet: function (event, inst) {
            const selectedYear = event.valueText;
            console.log('Selected year:', selectedYear);
            // Update the input field with the selected year
            document.getElementById('button-picker').value = selectedYear;
            // Update the visualization based on the selected year
            //const yearData = jsonData.find((summit) => summit.year === parseInt(selectedYear));
            //updateMapByYear(geojsonData, yearData, summitMap, summitsByCountryMap, currentZoomScale);
        }
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
    document.getElementById('select-year').addEventListener('click', function () {
        instance.open();
        return false;
    })
}