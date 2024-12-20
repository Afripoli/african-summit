import {
    initDesktopTimelineSVG,
    generateTimeline,
    drawTimeline,
    highlightItem,
} from "./timelineUtils.js";
import { maxYearsToShow } from "../common/globals.js";
import { drawMap, updateMap, clearCountryLabels } from "./mapUtils.js";

let isPlaying = false;
let currentYearIndex = 0;
let highlightIndex = 0;
let intervalId;
let timelineEnded = false;
let summitCounter = new Map();
let generalCounter = 0; // saves a counter for each loop. We'll use it for the map
let delay = 500;
let currentIndex = 0; // Variable to keep track of the current index of the timeline

// Function to initialize default page 
function initializePage(svg, geojsonData, summitData, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap) {
    //console.log('Summit data', countriesWithSummits)
    drawMap(geojsonData, countriesWithSummits, summitsByCountryMap);
    drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
    addTimelineItemClickListeners(svg);
    handleFirstArrowDisplay();
    arrowsClickListener(svg, geojsonData, summitData, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
}

function handleFirstArrowDisplay() {
    const firstArrow = document.querySelector(".up-arrow");
    //console.log('First arrow', firstArrow);
    if (firstArrow) {
        if (currentYearIndex === 0) {
            firstArrow.style.display = "none";
        } else {
            firstArrow.style.display = "block";
        }
    } else {
        console.error('First arrow or first arrow line not found in the DOM');
    }
}

function addPlayPauseEventListeners(svg, geojsonData, summitData, displayedYears, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits, currentYearIndex, highlightIndex) {
    const playButton = document.getElementById("playButtonDesktop");
    const pauseButton = document.getElementById("pauseButtonDesktop");
    const restartButton = document.getElementById("restartButtonDesktop");

    if (playButton) {
        playButton.addEventListener("click", function () {
            console.log('Play button clicked');
            console.log('Current year index', currentYearIndex, 'Highlight index', highlightIndex); 
            if (!isPlaying) {
                delay = 500; // Set delay to 500 when playing
                if (currentYearIndex == 0 && highlightIndex == 0) {
                    startOrResumeTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap, true);
                } else {
                    startOrResumeTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap, false);
                }
            }
        });
    } else {
        console.error('Play button not found in the DOM');
    }
    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            console.log('Pause button clicked');
            if (isPlaying) {
                delay = 0; // Set delay to 0 when paused
                stopTimeline();
            }
        });
    } else {
        console.error('Pause button not found in the DOM');
    }
    if (restartButton) {
        restartButton.addEventListener("click", () => {
            console.log('Restart button clicked');
            restartTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
        });
    } else {
        console.error('Restart button not found in the DOM');
    }
}

// To resume the timeline
function startOrResumeTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap, isStarting) {
    isPlaying = true;
    console.log(isStarting ? 'Starting timeline' : 'Resuming timeline');
    if (isStarting) {
        generalCounter = 0;
        //currentIndex = 0; // Reset currentIndex when starting
    }
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        //console.log('Interval running with delay:', delay);
        if (currentYearIndex < summitData.length) {
            const currentYearData = summitData[currentIndex];
            //console.log('Current year data', currentYearData);
            const hostCountry = currentYearData.summits.map((summit) => summit.country);
            const currentYear = currentYearData.year;
            //console.log('Displaying year', displayedYears);
            displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
            drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
            highlightItem(svg, summitData, highlightIndex, currentYearIndex); // Highlight the current year
            updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter, countriesWithSummits);
            highlightIndex += 1;
            currentIndex += 1;
            //console.log("General counter is", generalCounter);
            if (highlightIndex >= maxYearsToShow) {
                currentYearIndex += maxYearsToShow; // Advance by 5 years to the next subset
                highlightIndex = 0;
                // If the end of the data is reached, stop the interval
                if (currentYearIndex >= summitData.length) {
                    clearInterval(intervalId); // Stop the timeline when all years have been shown
                    console.log("Timeline reached the last observation and has stopped.");
                    timelineFinished(
                        svg,
                        geojsonData,
                        summitData,
                        currentYearIndex,
                        countriesWithSummits,
                        cumulativeSummits,
                        summitsByCountryMap
                    );
                } else {
                    // Display the next set of 5 years
                    drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
                }
            }
            
        }
    }, delay)
}    

function stopTimeline() {
    isPlaying = false;
    clearInterval(intervalId);
    console.log('Timeline paused');
}
function restartTimeline(svg, geojsonData, summitData, displayedYears, /*summitMap,*/ countriesWithSummits, cumulativeSummits, summitsByCountryMap) {
    clearInterval(intervalId);
    currentYearIndex = 0;
    highlightIndex = 0;
    generalCounter = 0;
    currentIndex = 0; // Reset currentIndex when restarting
    resetSummitCounter();
    delay = 500;
    if (isPlaying) {
        console.log("Interval ID PAUSE", intervalId);
        clearInterval(intervalId); // Pause the timeline if already playing
    }
    isPlaying = true; // Set to playing
    startOrResumeTimeline(svg, geojsonData, summitData, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap, true); // This function should handle the timeline progression
}
//function startOrResumeTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap, isStarting) {

function playTimeline(svg, geojsonData, summitData, displayedYears, summitMap, countriesWithSummits, cumulativeSummits, summitsByCountryMap, currentYearIndex, highlightIndex) {
    //console.log('summit data', summitData);
    //console.log('Summit map', summitMap);
    isPlaying = true;
    console.log('Starting timeline');
    generalCounter = 0;
    //function startPlaying(currentYearIndex, highlightIndex) {
    //clearInterval(intervalId);
    intervalId = setInterval(() => {
        const currentYearData = summitData[generalCounter];
        const hostCountry = currentYearData.summits.map((summit) => summit.country);
        const currentYear = currentYearData.year;
        displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
        drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
        highlightItem(svg, summitData, highlightIndex, currentYearIndex); // Highlight the current year
        updateMap(geojsonData, summitMap, currentYear, summitsByCountryMap, hostCountry, summitCounter, countriesWithSummits);
        highlightIndex += 1;
        generalCounter += 1;
        //console.log("General counter is", generalCounter);
        if (highlightIndex >= maxYearsToShow) {
            currentYearIndex += maxYearsToShow; // Advance by 5 years to the next subset
            highlightIndex = 0;
            // If the end of the data is reached, stop the interval
            if (currentYearIndex >= summitData.length) {
                clearInterval(intervalId); // Stop the timeline when all years have been shown
                console.log("Timeline reached the last observation and has stopped.");
                timelineFinished(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits);
            } else {
                // Display the next set of 5 years
                generateTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
            }
        }
        if (currentYearIndex >= summitData.length) {
            clearInterval(intervalId); // Stop at the end of the timeline
            isPlaying = false;
        }
        //console.log("Checking if values save correctly", currentYearIndex, highlightIndex);
    }, delay);
}

function addTimelineItemClickListeners(svg) {
    svg.selectAll("circle.year-item") // or whatever selector you use for your timeline items
        .on("click", function (event, d) {
            const clickedYearData = summitData[d.index]; // Get data based on the index of the clicked item
            highlightHostCountries(clickedYearData); // Highlight corresponding host countries
        });
}
export function arrowsClickListener(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits, summitsByCountryMap) {
    let currentYearafterUpdate = currentYearIndex + maxYearsToShow;
    let displayedYears;

    // Define named event handler functions to add/remove listeners
    function handleUpArrowClick() {
        //console.log("Up arrow clicked");
        handleArrowClick(-maxYearsToShow);
    }
    function handleDownArrowClick() {
        //console.log("Down arrow clicked");
        handleArrowClick(maxYearsToShow);
    }
    function handleArrowClick(maxYearsToShow) {
        //console.log("On click | Current year index", currentYearIndex,"| Current year updated", currentYearafterUpdate); 
        if (maxYearsToShow < 0) {
            // Click Arrow up
            if (currentYearIndex === 0) {
                // If at the start, wrap around to the end
                currentYearIndex = summitData.length + maxYearsToShow; // max years to show is negative - 40
                currentYearafterUpdate = summitData.length; // 40
            } else {
                currentYearafterUpdate = currentYearIndex;
                currentYearIndex = Math.max(0, currentYearIndex + maxYearsToShow);
            }
        } else {
            if (currentYearafterUpdate >= summitData.length) {
                // If at the end, wrap around to the start
                currentYearIndex = 0;
                currentYearafterUpdate = currentYearIndex + maxYearsToShow;
            } else {
                currentYearIndex = currentYearafterUpdate;
                currentYearafterUpdate = Math.min(summitData.length, currentYearIndex + maxYearsToShow);
            }
        }
        displayedYears = summitData.slice(currentYearIndex, currentYearafterUpdate);
        clearCountryLabels();
        drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
    }
    // Attach event listeners to the arrows
    svg.selectAll(".up-arrow").on("click", handleUpArrowClick);
    svg.selectAll(".down-arrow").on("click", handleDownArrowClick);
}

function timelineFinished(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits, summitsByCountryMap) {
    clearInterval(intervalId); // Clear the interval when the timeline finishes
    console.log("Timeline finished - input - current year index", currentYearIndex);
    timelineEnded = true; // Set the flag to true when the timeline ends
    addTimelineItemClickListeners(svg);
    arrowsClickListener(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
    //updateMapByYear(geojsonData, year, cumulativeSummits)
}
function resetSummitCounter() {
    console.log("Clearing summitCounter...");
    summitCounter.clear();
    //console.log("Summit counter after clearing:", summitCounter);
}
export function initDesktopTimeline(geojsonData, summitData, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits) {
    const svg = initDesktopTimelineSVG();
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    initializePage(svg, geojsonData, summitData, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
    addPlayPauseEventListeners(svg, geojsonData, summitData, displayedYears, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits, currentYearIndex, highlightIndex);
    // Ensure arrow event listeners are attached
    arrowsClickListener(svg, geojsonData, summitData, currentYearIndex, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
}

