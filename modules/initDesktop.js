import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendArrows } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap } from "./mapUtils.js";

export function initDesktopTimeline(geojsonData, jsonData /*, summitMap, summitsByCountryMap, summitCounter*/) {
    let isPlaying = false; // To track whether the timeline is playing or paused
    let intervalId = null;
    let currentYearIndex = 0;
    let highlightIndex = 0;
    //drawMap(geojsonData);

    const playPauseButton = document.getElementById('playButtonDesktop');

    playPauseButton.addEventListener('click', () => {
        // Toggle the isPlaying state as soon as the button is clicked
        isPlaying = !isPlaying;

        if (isPlaying) {
            playPauseButton.innerHTML = '<img src="/src/img/pause.svg" class="play-med" alt="Pause button">'; // Change to play icon
            const desktopTimelineElement = document.getElementById('desktop-timeline');
            desktopTimelineElement.innerHTML = '';  // Clear the timeline container
            const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG
            currentYearIndex = 0;
            highlightIndex = 0;
            generateTimeline(svg, jsonData, currentYearIndex);  // Generate the timeline from the start
            intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex);  // Start the timeline        } else {
        } else {
            // When the timeline is paused
            clearInterval(intervalId);  // Stop the timeline
            playPauseButton.innerHTML = '<img src="/src/img/play.svg" class="play-med" alt="Play button">';  // Change to play icon immediately
            console.log(`Timeline paused at index: ${currentYearIndex}`);
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
    const intervalDuration = 100;
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
                appendArrows(svg, jsonData, currentYearIndex);  // Call to append arrows when the timeline stops
                console.log("Timeline reached the last observation and has stopped.");
            } else {
                // Display the next set of 5 years
                generateTimeline(svg, jsonData, currentYearIndex);
            }
        }
    }, intervalDuration)
}