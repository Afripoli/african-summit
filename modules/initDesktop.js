import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendArrows } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap } from "./mapUtils.js";

export function initDesktopTimeline(geojsonData, jsonData /*, summitMap, summitsByCountryMap, summitCounter*/) {
    //let highlightIndex = 0;
    let intervalId = null;
    let currentYearIndex = 0;
    let highlightIndex = 0;
    //drawMap(geojsonData);

    document.getElementById('playButtonDesktop').addEventListener('click', () => {
        const desktopTimelineElement = document.getElementById('desktop-timeline');
        desktopTimelineElement.innerHTML = '';
        const svg = initDesktopTimelineSVG();
        // Display by default first 5 years
        generateTimeline(svg, jsonData, currentYearIndex);
        if (!intervalId) {
            //highlightIndex = 0; // Reset highlight index
            // Generate the timeline with the current year index
            generateTimeline(svg, jsonData, currentYearIndex);
            // Start the timeline
            intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex);
            console.log("Timeline started from year index:", currentYearIndex);
        } else {
            console.log("Timeline is already running.");
        }
        // Then run timeline
        // if (intervalId) {
        //     clearInterval(intervalId);  // Stop any previous interval if the button is clicked again
        // }
        // intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex, intervalId);
        // resetSummitCounter();
        // if (intervalId) {
        //     clearInterval(intervalId);
        // } 
    });
    document.getElementById('pauseButtonDesktop').addEventListener('click', () => {
        if (intervalId) {  // If the interval is running
            clearInterval(intervalId);  // Stop the interval
            intervalId = null;  // Reset intervalId
            console.log("Timeline stopped at year index:", currentYearIndex);
        }
    });
    document.getElementById('restartButtonDesktop').addEventListener('click', () => {
        const desktopTimelineElement = document.getElementById('desktop-timeline');
        desktopTimelineElement.innerHTML = '';
        if (intervalId) {  // Clear any running interval
            clearInterval(intervalId);
        }
        currentYearIndex = 0;  // Reset index to the beginning
        highlightIndex = 0; // Reset highlight index

        const svg = initDesktopTimelineSVG();
        generateTimeline(svg, jsonData, currentYearIndex);
        intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex);
        console.log("Timeline restarted.");
    });
}
function startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex, intervalId) {
    const intervalDuration = 100;  // Time in milliseconds between each advancement

    intervalId = setInterval(() => {
        const displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the set of 5 years
        highlightItem(svg, displayedYears, highlightIndex);
        // Move to the next year to highlight within the same set
        highlightIndex++;
        // Once all 5 years are highlighted, move to the next set of 5 years
        if (highlightIndex >= maxYearsToShow) {
            currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
            highlightIndex = 0;
            // If the end of the data is reached, stop the interval
            if (currentYearIndex >= jsonData.length) {
                clearInterval(intervalId);  // Stop the timeline when all years have been shown
                // currentYearIndex = currentYearIndex - maxYearsToShow;
                appendArrows(svg, jsonData, currentYearIndex);  // Call to append arrows when the timeline stops
                console.log("Timeline reached the last observation and has stopped.");
            } else {
                // Display the next set of 5 years
                generateTimeline(svg, jsonData, currentYearIndex);
            }
        } 
        // else {
        //     highlightYear(svg, jsonData, currentYearIndex);
        //     highlightIndex++;
        // }
    },intervalDuration )
    // return setInterval(() => {
    //     const displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the set of 5 years
    //     highlightYear(svg, displayedYears, highlightIndex);
    //     // Move to the next year to highlight within the same set
    //     highlightIndex++;
    //     // Once all 5 years are highlighted, move to the next set of 5 years
    //     if (highlightIndex >= maxYearsToShow) {
    //         currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
    //         highlightIndex = 0;
    //         // If the end of the data is reached, stop the interval
    //         if (currentYearIndex >= jsonData.length) {
    //             clearInterval(intervalId);  // Stop the timeline when all years have been shown
    //             appendArrows(svg, jsonData, currentYearIndex);  // Call to append arrows when the timeline stops
    //             console.log("Timeline reached the last observation and has stopped.");
    //             return;
    //         } else {
    //             // Display the next set of 5 years
    //             generateTimeline(svg, jsonData, currentYearIndex);
    //         }
    //     }
    // }, intervalDuration);
}
// function advanceTimeline(svg, jsonData, displayedYears, currentYearIndex) {
//     console.log('Json data check', jsonData)
//     const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
//     const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
//     displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
//     // Redraw or update the SVG elements (circles, text, etc.) to reflect the new set of years
//     drawTimeline(svg, displayedYears, currentYearIndex, containerHeight, containerWidth, jsonData);  // You'll pass the correct data here
//     highlightYear(svg, jsonData, currentYearIndex); 
// }