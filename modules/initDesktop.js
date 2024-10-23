import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendArrows } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap, updateMap } from "./mapUtils.js";

let isPlaying = false;
let currentYearIndex = 0;
let highlightIndex = 0;
let intervalId;
let timelineEnded = false;
let summitCounter = new Map();

function playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, containerHeight, containerWidth) {
    function startPlaying(currentYearIndex, highlightIndex) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            console.log('Start playing function: Current year input', currentYearIndex, 'Highlight year input', highlightIndex)

            //console.log('Summit data', summitData);
            const currentYearData = summitData[currentYearIndex];
            const hostCountry = currentYearData.summits.map(summit => summit.country);
            const currentYear = currentYearData.year;
            //console.log('Host country is', hostCountry);
            //console.log('Current year', currentYear)
            drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth, maxYearsToShow, hostCountry);
            highlightItem(svg, summitData, highlightIndex, currentYearIndex);  // Highlight the current year
            updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter)
            highlightIndex += 1;
            if (highlightIndex >= maxYearsToShow) {
                currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
                highlightIndex = 0;
                // If the end of the data is reached, stop the interval
                if (currentYearIndex >= summitData.length) {
                    clearInterval(intervalId);  // Stop the timeline when all years have been shown
                    appendArrows(svg, summitData, currentYearIndex);  // Call to append arrows when the timeline stops
                    console.log("Timeline reached the last observation and has stopped.");
                    timelineFinished(); 
                } else {
                    // Display the next set of 5 years
                    generateTimeline(svg, summitData, currentYearIndex);
                }
            }
            if (currentYearIndex >= summitData.length) {
                clearInterval(intervalId);  // Stop at the end of the timeline
                playPauseBtn.innerHTML = '<img src="/src/img/play.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
                isPlaying = false;
            }
        }, 500);  
        return { currentYearIndex, highlightIndex };
        console.log('Interval ID PLAY', intervalId)
    }
    // Play/Pause button logic
    const playPauseBtn = document.getElementById('playButtonDesktop');
    playPauseBtn.addEventListener('click', function () {
        //console.log('SHOULD BE PLAYING', isPlaying)
        console.log('PLAY BUTTON CLICKED AND CurrentIndex', currentYearIndex, 'Highlight Index', highlightIndex)
        if (isPlaying) { // Check if is playing because we want to PAUSE
            const indices = startPlaying(currentYearIndex, highlightIndex);
            currentYearIndex = indices.currentYearIndex;
            highlightIndex = indices.highlightIndex;     
            console.log('Interval ID PAUSE', intervalId)
            console.log('Current year at PAUSE', currentYearIndex, 'Highlight Index at PAUSE', highlightIndex)
            clearInterval(intervalId);  // Pause timeline
            playPauseBtn.innerHTML = '<img src="/src/img/play.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
            isPlaying = false;
        } else { // IF TIMELINE IS NOT PLAYING
            if (timelineEnded) { // If the timeline has ended, restart from the beginning
                console.log('Timeline ended.')
                currentYearIndex = 0;  // Reset the index
                highlightIndex = 0;
                timelineEnded = false;  // Reset the flag
            }
            const indices = startPlaying(currentYearIndex, highlightIndex);
            currentYearIndex = indices.currentYearIndex;
            highlightIndex = indices.highlightIndex;     
            playPauseBtn.innerHTML = '<img src="/src/img/pause.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
            isPlaying = true;
            //startPlaying(currentYearIndex, highlightIndex);
        }
    });
    // Restart button
    const restartBtn = document.getElementById('restartButtonDesktop');
    restartBtn.addEventListener('click', function() {
        clearInterval(intervalId);
        currentYearIndex = 0;
        highlightIndex = 0;
        resetSummitCounter();

        // 1. Redraw the timeline from the first year
        //drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth); 
        // 2. Check if it's already playing
        if (isPlaying) {
            console.log('Interval ID PAUSE', intervalId);
            clearInterval(intervalId);  // Pause the timeline if already playing
        }
        // 3. Change play button to pause button and restart timeline autoplay
        playPauseBtn.innerHTML = '<img src="/src/img/pause.svg" class="play-med img-fluid" alt="Pause button">'; // Change to pause icon
        isPlaying = true; // Set to playing
        // 4. Restart the autoplay from the beginning
        startPlaying(currentYearIndex, highlightIndex); // This function should handle the timeline progression
    })
}
function timelineFinished() {
    clearInterval(intervalId);  // Clear the interval when the timeline finishes
    timelineEnded = true;  // Set the flag to true when the timeline ends
}
function resetSummitCounter() {
    summitCounter.clear();
}

export function initDesktopTimeline(geojsonData, summitData, summitMap, summitCounter, summitsByCountryMap) {
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
     const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG
    // Initially display the first 5 years
    //drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth, maxYearsToShow);
    generateTimeline(svg, summitData, currentYearIndex)
    drawMap(geojsonData);
    // Initialize play/pause functionality
    playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, summitCounter, summitsByCountryMap);
}
