import { initDesktopTimelineSVG, generateTimeline, drawTimeline, highlightItem, appendUpArrow, appendDownArrow, updateTimelineUp, updateTimelineDown, highlightClickedItem } from "./timelineUtils.js";
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
    generalCounter = 0
    //console.log('Function PLAYTIMELINE ACTIVATED')
    function startPlaying(currentYearIndex, highlightIndex) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            console.log('Start playing function: Current year input', currentYearIndex, 'Highlight year input', highlightIndex)
            console.log('Summit data', summitData);
            console.log('General counter', generalCounter);
            console.log('Summit counter values', summitCounter);
            const currentYearData = summitData[generalCounter];
            const hostCountry = currentYearData.summits.map(summit => summit.country);
            const currentYear = currentYearData.year;
            console.log('Host country is', hostCountry);
            let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
            //console.log('Current year', currentYear)
            drawTimeline(svg, summitData, displayedYears);
            highlightItem(svg, summitData, highlightIndex, currentYearIndex);  // Highlight the current year
            updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter)
            highlightIndex += 1;
            generalCounter += 1;
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
                    generateTimeline(svg, summitData, displayedYears);
                }
            }
            if (currentYearIndex >= summitData.length) {
                clearInterval(intervalId);  // Stop at the end of the timeline
                playPauseBtn.innerHTML = '<img src="/src/img/play-white.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
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
            playPauseBtn.innerHTML = '<img src="/src/img/play-white.svg" class="play-med img-fluid" alt="Play button">';  // Reset button to Play
            isPlaying = false;
        } else { // IF TIMELINE IS NOT PLAYING
            if (timelineEnded) { // If the timeline has ended, restart from the beginning
                console.log('Restarting timeline from the beginning.');
                currentYearIndex = 0;  // Reset the index
                highlightIndex = 0;
                generalCounter = 0;
                resetSummitCounter();
                timelineEnded = false;  // Reset the flag
            }
            // Resume from the saved current year and highlight index
            startPlaying(currentYearIndex, highlightIndex);
            console.log('Resuming from Current Year Index:', currentYearIndex, 'Highlight Index:', highlightIndex);
            playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
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
        generalCounter = 0;
        resetSummitCounter();
        if (isPlaying) {
            console.log('Interval ID PAUSE', intervalId);
            clearInterval(intervalId);  // Pause the timeline if already playing
        }
        // 3. Change play button to pause button and restart timeline autoplay
        playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to pause icon
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
        });
}
function arrowsClickListener(svg, summitData, currentYearIndex) {
    console.log('FIRST Current year index', currentYearIndex)
    let currentYearafterUpdate = currentYearIndex;
    let displayedYears;
    const upArrowDiv = document.querySelector('.up-arrow');
    const downArrowDiv = document.querySelector('.down-arrow');
    function handleArrowClick(maxYearsToShow) {
        console.log('On click | Current year index', currentYearIndex, '| Current year updated', currentYearafterUpdate) // 
        if (maxYearsToShow < 0) { // Click Arrow up
            currentYearafterUpdate = currentYearIndex;
            currentYearIndex = currentYearIndex + maxYearsToShow;
            displayedYears = summitData.slice(currentYearIndex, currentYearafterUpdate);
        } else { // Click arrow down
            currentYearIndex = currentYearafterUpdate;
            currentYearafterUpdate = currentYearIndex + maxYearsToShow;
            displayedYears = summitData.slice(currentYearIndex, currentYearafterUpdate);    
        }
        
        // if (maxYearsToShow < 0) { // Click Arrow up
        //     if (currentYearafterUpdate === 4) {
        //         currentYearafterUpdate = summitData.length;
        //         currentYearMin = summitData.length; // 44
        //     } 
        //     else if (currentYearMax === undefined) {
        //         currentYearafterUpdate = currentYearafterUpdate + maxYearsToShow;
        //         currentYearMax = currentYearafterUpdate; 
        //     }
        //     // Update values
        //     currentYearafterUpdate = currentYearMin;  // 
        //     currentYearMin = currentYearafterUpdate + maxYearsToShow; // 
        //     currentYearMax = currentYearafterUpdate; // 
        //     displayedYears = summitData.slice(currentYearMin, currentYearafterUpdate);
        //     console.log('Arrow up | Min value: ', currentYearMin, 'Current year updated: ', currentYearafterUpdate);
        //     console.log('Arrow up | Displayed years: ', displayedYears)
        //     // 28 - 32 - 32
        // } else if (maxYearsToShow > 0) { // Click arrow down
        //     if (currentYearafterUpdate >= summitData.length - 4) {
        //         currentYearafterUpdate = -4;
        //     } 
        //     else if (currentYearMax === undefined) {
        //          currentYearMax = currentYearafterUpdate
        //     }
        //     // Update values
        //     currentYearafterUpdate = currentYearMax; // 
        //     currentYearMin = currentYearafterUpdate - maxYearsToShow; // 
        //     currentYearMax = currentYearMax + maxYearsToShow; // 
        //     displayedYears = summitData.slice(currentYearafterUpdate, currentYearMax);
        //     console.log('Arrow down | Current year updated: ', currentYearafterUpdate, 'Max value: ', currentYearMax)
        //     console.log('Arrow down | Displayed years: ', displayedYears)
        // }
        drawTimeline(svg, summitData, displayedYears);
    }

    function attachArrowEventListeners() {
        upArrowDiv.addEventListener("click", () => handleArrowClick(-maxYearsToShow));
        downArrowDiv.addEventListener("click", () => handleArrowClick(maxYearsToShow));
    }
    // Initial attachment of arrow listeners
    attachArrowEventListeners();
}

function timelineFinished(svg, summitData, currentYearIndex) {
    clearInterval(intervalId);  // Clear the interval when the timeline finishes
    console.log('Timeline finished - input - current year index', currentYearIndex)
    appendUpArrow();
    appendDownArrow();
    timelineEnded = true;  // Set the flag to true when the timeline ends
    addTimelineItemClickListeners(svg);
    arrowsClickListener(svg, summitData, currentYearIndex);
    //highlightClickedItem(svg, clickedData)
}
function resetSummitCounter() {
    console.log('Clearing summitCounter...');
    summitCounter.clear();
    console.log('Summit counter after clearing:', summitCounter);
}

export function initDesktopTimeline(geojsonData, summitData, summitMap, summitCounter, summitsByCountryMap) {
    const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG
    // Initially display the first 5 years
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
    console.log('Displaying years by default', displayedYears)
    generateTimeline(svg, summitData, displayedYears);
    drawMap(geojsonData);
    // Initialize play/pause functionality
    playTimeline(svg, summitData, geojsonData, summitMap, summitCounter, summitsByCountryMap);
}
