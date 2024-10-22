import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightYear } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap } from "./mapUtils.js";

export function initDesktopTimeline(geojsonData, jsonData /*, summitMap, summitsByCountryMap, summitCounter*/) {
    //let highlightIndex = 0;
    let intervalId = null; 
    let currentYearIndex = 0;  
    let highlightIndex = 0; 
    //drawMap(geojsonData);
    document.getElementById('restartButtonDesktop').addEventListener('click', () => {
        const desktopTimelineElement = document.getElementById('desktop-timeline');
        desktopTimelineElement.innerHTML = ''; 
        const svg = initDesktopTimelineSVG();
        currentYearIndex = 0;
        highlightIndex = 0;
        //let displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
        // Display by default first 5 years
        generateTimeline(svg, jsonData, currentYearIndex);
        // Then run timeline
        if (intervalId) {
            clearInterval(intervalId);  // Stop any previous interval if the button is clicked again
        }
        intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex, intervalId);
        console.log("Timeline started/restarted for desktop");
        // resetSummitCounter();
        // if (intervalId) {
        //     clearInterval(intervalId);
        // } 
    });
}
function startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex, intervalId) {
    const intervalDuration = 200;  // Time in milliseconds between each advancement
    return setInterval(() => {
        const displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the set of 5 years
        highlightYear(svg, displayedYears, highlightIndex);
        // Move to the next year to highlight within the same set
        highlightIndex++;

         // Once all 5 years are highlighted, move to the next set of 5 years
         if (highlightIndex >= maxYearsToShow) {
            currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
            highlightIndex = 0;
            // If the end of the data is reached, stop the interval
            if (currentYearIndex >= jsonData.length) {
                clearInterval(intervalId);  // Stop the timeline when all years have been shown
                console.log("Timeline reached the last observation and has stopped.");
            } else {
                // Display the next set of 5 years
                generateTimeline(svg, jsonData, currentYearIndex);
            }
         }

        // Call a function to advance the timeline by 1 set of 5 years or so
        // advanceTimeline(svg, jsonData, displayedYears, currentYearIndex);
        // if (currentYearIndex >= jsonData.length - maxYearsToShow) {
        //     clearInterval(intervalId); 
        //     console.log("Timeline reached the last observation and has stopped.");
        //     return;
        // } else {
        //     currentYearIndex++;
        // }

    }, intervalDuration);
}
function advanceTimeline(svg, jsonData, displayedYears, currentYearIndex) {
    console.log('Json data check', jsonData)
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
    displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    // Redraw or update the SVG elements (circles, text, etc.) to reflect the new set of years
    drawTimeline(svg, displayedYears, currentYearIndex, containerHeight, containerWidth, jsonData);  // You'll pass the correct data here
    highlightYear(svg, jsonData, currentYearIndex); 
}