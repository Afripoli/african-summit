import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendArrows, updateTimeline, updateTimelineDown } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap, updateMap } from "./mapUtils.js";

let isPlaying = false;
let currentYearIndex = 0;
let highlightIndex = 0;
let intervalId;
let timelineEnded = false;
let summitCounter = new Map();
let generalCounter = 0; // saves a counter for each loop. We'll use it for the map

function playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap) {
    console.log('Function PLAYTIMELINE ACTIVATED')
    function startPlaying(currentYearIndex, highlightIndex) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            console.log('Start playing function: Current year input', currentYearIndex, 'Highlight year input', highlightIndex)

            //console.log('Summit data', summitData);
            const currentYearData = summitData[generalCounter];
            const hostCountry = currentYearData.summits.map(summit => summit.country);
            const currentYear = currentYearData.year;
            console.log('Host country is', hostCountry);
            let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
            //console.log('Current year', currentYear)
            drawTimeline(svg, summitData, currentYearIndex, displayedYears);
            highlightItem(svg, summitData, highlightIndex, currentYearIndex);  // Highlight the current year
            updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter)
            highlightIndex += 1;
            generalCounter +=1;
            console.log('General counter is', generalCounter)
            if (highlightIndex >= maxYearsToShow) {
                currentYearIndex += maxYearsToShow;  // Advance by 5 years to the next subset
                highlightIndex = 0;
                // If the end of the data is reached, stop the interval
                if (currentYearIndex >= summitData.length) {
                    clearInterval(intervalId);  // Stop the timeline when all years have been shown
                    console.log("Timeline reached the last observation and has stopped.");
                    timelineFinished(svg, summitData, currentYearIndex);
                } else {
                    // Display the next set of 5 years
                    generateTimeline(svg, summitData, currentYearIndex, displayedYears);
                }
            }
            if (currentYearIndex >= summitData.length) {
                clearInterval(intervalId);  // Stop at the end of the timeline
                playPauseBtn.innerHTML = '<img src="/src/img/play.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
                isPlaying = false;
            }
            console.log('Checking if values save correctly', currentYearIndex, highlightIndex)
        }, 100);
    }
    // Play/Pause button logic
    const playPauseBtn = document.getElementById('playButtonDesktop');
    playPauseBtn.addEventListener('click', function () {
        console.log('PLAY BUTTON CLICKED AND CurrentIndex', currentYearIndex, 'Highlight Index', highlightIndex)
        if (isPlaying) { // Check if is playing because we want to PAUSE
            clearInterval(intervalId);  // Pause timeline
            console.log('Pausing at Current Year Index:', currentYearIndex, 'Highlight Index:', highlightIndex);
            playPauseBtn.innerHTML = '<img src="/src/img/play.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
            isPlaying = false;
        } else { // IF TIMELINE IS NOT PLAYING
            if (timelineEnded) { // If the timeline has ended, restart from the beginning
                console.log('Restarting timeline from the beginning.');
                currentYearIndex = 0;  // Reset the index
                highlightIndex = 0;
                timelineEnded = false;  // Reset the flag
            }
            // Resume from the saved current year and highlight index
            startPlaying(currentYearIndex, highlightIndex);
            console.log('Resuming from Current Year Index:', currentYearIndex, 'Highlight Index:', highlightIndex);
            playPauseBtn.innerHTML = '<img src="/src/img/pause.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
            isPlaying = true;
            //startPlaying(currentYearIndex, highlightIndex);
        }
    });
    // Restart button
    const restartBtn = document.getElementById('restartButtonDesktop');
    restartBtn.addEventListener('click', function () {
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
function addTimelineItemClickListeners(svg) {
    svg.selectAll("circle.year-item") // or whatever selector you use for your timeline items
        .on("click", function (event, d) {
            const clickedYearData = summitData[d.index]; // Get data based on the index of the clicked item
            highlightHostCountries(clickedYearData); // Highlight corresponding host countries
            // Additional actions you may want to take
        });
}
function addArrowClickListeners(svg, summitData, currentYearIndex) {
    console.log('Adding arrow click event listeners')
    const upArrow = document.querySelector('.up-arrow');
    upArrow.addEventListener("click", () => {
        console.log('Clicking Up arrow');
        currentYearIndex = currentYearIndex - maxYearsToShow;
        updateTimeline(-maxYearsToShow, svg, summitData, currentYearIndex);
    });
    const downArrow = document.querySelector('.down-arrow');
    downArrow.addEventListener("click", () => {
        console.log('Clicking Down Arrow');
        currentYearIndex = currentYearIndex + maxYearsToShow;
        if (currentYearIndex <= summitData.length) {
            updateTimelineDown(maxYearsToShow, svg, summitData, currentYearIndex);
        } else {
            console.log('Reached the end of the timeline. Down arrow disabled.');
            // Optionally, disable the down arrow by adding a class or removing the event listener
            downArrow.classList.add('down-arrow', 'disabled');  // Add a class to visually disable it
            downArrow.style.cursor = 'not-allowed'; // Change cursor to indicate it's not clickable
            //downArrow.removeEventListener("click", arguments.callee); // Disable the click event
        }
        
    });
}
function timelineFinished(svg, summitData, currentYearIndex) {
    clearInterval(intervalId);  // Clear the interval when the timeline finishes
    appendArrows(svg, summitData, currentYearIndex);  // Call to append arrows when the timeline stops
    timelineEnded = true;  // Set the flag to true when the timeline ends
    addTimelineItemClickListeners(svg);
    addArrowClickListeners(svg, summitData, currentYearIndex);
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
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
    console.log('Displaying years by default', displayedYears)
    generateTimeline(svg, summitData, currentYearIndex, displayedYears);
    drawMap(geojsonData);
    // Initialize play/pause functionality
    playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, summitCounter, summitsByCountryMap);
}
