import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendArrows } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap } from "./mapUtils.js";

let currentYearIndex = 0;
let highlightIndex = 0;
let intervalId;

function playTimeline(svg, summitData, containerHeight, containerWidth) {
    let isPlaying = false;

    // Play/Pause button
    const playPauseBtn = document.getElementById('playButtonDesktop');
    function startPlaying() {
        //currentYearIndex = 0;  // Always start from the first year
        //highlightIndex = 0;
        intervalId = setInterval(() => {
            drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth, maxYearsToShow);
            highlightItem(svg, summitData, highlightIndex, currentYearIndex);  // Highlight the current year
            highlightIndex++;
            currentYearIndex += 1;
            console.log('Highlight index is', highlightIndex)
            if (highlightIndex >= maxYearsToShow) {
                currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
                highlightIndex = 0;
                console.log('Highlight index reset to 0')
                console.log('Current year index is', currentYearIndex)
                console.log('Summit Data Length', summitData.length)
                // If the end of the data is reached, stop the interval
                if (currentYearIndex >= summitData.length) {
                    clearInterval(intervalId);  // Stop the timeline when all years have been shown
                    appendArrows(svg, summitData, currentYearIndex);  // Call to append arrows when the timeline stops
                    console.log("Timeline reached the last observation and has stopped.");
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
        }, 200);  // Adjust timing as needed
        console.log('Interval ID PLAY', intervalId)
    }
    // Play/Pause button logic
    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            console.log('Interval ID PAUSE', intervalId)
            clearInterval(intervalId);  // Pause timeline
            playPauseBtn.innerHTML = '<img src="/src/img/play.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
            isPlaying = false;
        } else {
            playPauseBtn.innerHTML = '<img src="/src/img/pause.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
            isPlaying = true;
            startPlaying();
        }
    });
    // Restart button
    const restartBtn = document.getElementById('restartButtonDesktop');
    restartBtn.addEventListener('click', function() {
        startPlaying();
    })
}

export function initDesktopTimeline(geojsonData, summitData) {
    const containerHeight = document.getElementById("desktop-timeline").offsetHeight;
    const containerWidth = document.getElementById("desktop-timeline").offsetWidth;
     const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG

    // Initially display the first 5 years
    drawTimeline(svg, summitData, currentYearIndex, containerHeight, containerWidth, maxYearsToShow);

    // Initialize play/pause functionality
    playTimeline(svg, summitData, containerHeight, containerWidth);
}


// export function initDesktopTimeline(geojsonData, jsonData /*, summitMap, summitsByCountryMap, summitCounter*/) {
//     let isPlaying = false; // To track whether the timeline is playing or paused
//     let intervalId = null;
//     let currentYearIndex = 0;
//     let highlightIndex = 0;
//     //drawMap(geojsonData);
//     const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG
//     drawTimeline(svg, jsonData, currentYearIndex)
//     const playPauseButton = document.getElementById('playButtonDesktop');
//     playPauseButton.addEventListener('click', () => {
//         // Toggle the isPlaying state as soon as the button is clicked
//         isPlaying = !isPlaying;
//         console.log('SVG exists here', svg)
//         if (isPlaying) {
//             playPauseButton.innerHTML = '<img src="/src/img/pause.svg" class="play-med" alt="Pause button">'; // Change to play icon
//             const desktopTimelineElement = document.getElementById('desktop-timeline');
//             desktopTimelineElement.innerHTML = '';  // Clear the timeline container
//             currentYearIndex = 0;
//             highlightIndex = 0;
//             generateTimeline(svg, jsonData, currentYearIndex);  // Generate the timeline from the start
//             intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex);  // Start the timeline        } else {
//         } else {
//             // When the timeline is paused
//             clearInterval(intervalId);  // Stop the timeline
//             playPauseButton.innerHTML = '<img src="/src/img/play.svg" class="play-med" alt="Play button">';  // Change to play icon immediately
//             console.log(`Timeline paused at index: ${currentYearIndex}`);
//         }
//     });
    
//     document.getElementById('restartButtonDesktop').addEventListener('click', () => {
//         const desktopTimelineElement = document.getElementById('desktop-timeline');
//         desktopTimelineElement.innerHTML = '';
//         if (intervalId) {  // Clear any running interval
//             clearInterval(intervalId);
//         }
//         currentYearIndex = 0;  // Reset index to the beginning
//         highlightIndex = 0; // Reset highlight index
//         const svg = initDesktopTimelineSVG();
//         generateTimeline(svg, jsonData, currentYearIndex);
//         intervalId = startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex);
//         console.log("Timeline restarted.");
//     });
// }
// function startTimelineAutoAdvance(svg, jsonData, currentYearIndex, highlightIndex, intervalId) {
//     const intervalDuration = 100;
//     intervalId = setInterval(() => {
//         const displayedYears = jsonData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);  // Get the set of 5 years
//         highlightItem(svg, displayedYears, highlightIndex);
//         // Move to the next year to highlight within the same set
//         highlightIndex++;
//         // Once all 5 years are highlighted, move to the next set of 5 years
//         if (highlightIndex >= maxYearsToShow) {
//             currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
//             highlightIndex = 0;
//             // If the end of the data is reached, stop the interval
//             if (currentYearIndex >= jsonData.length) {
//                 clearInterval(intervalId);  // Stop the timeline when all years have been shown
//                 appendArrows(svg, jsonData, currentYearIndex);  // Call to append arrows when the timeline stops
//                 console.log("Timeline reached the last observation and has stopped.");
//             } else {
//                 // Display the next set of 5 years
//                 generateTimeline(svg, jsonData, currentYearIndex);
//             }
//         }
//     }, intervalDuration)
// }

