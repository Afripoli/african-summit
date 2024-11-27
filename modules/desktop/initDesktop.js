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

// Function to initialize default page 
function initializePage(svg, geojsonData, summitData, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap) {
    console.log('Summit data', countriesWithSummits)
    drawMap(geojsonData, countriesWithSummits, summitsByCountryMap);
    drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);
    addTimelineItemClickListeners(svg);
    const firstArrow = document.querySelector(".up-arrow");
    //const firstArrowLine = document.querySelector(".up-arrow-line");

    console.log('First arrow', firstArrow);
    //console.log('First arrow line', firstArrowLine);
    if (firstArrow) {
        if (currentYearIndex === 0) {
            firstArrow.style.display = "none";
            //firstArrowLine.style.display = "none";
        } else {
            firstArrow.style.display = "block";
            //firstArrowLine.style.display = "block";
        }
    } else {
        console.error('First arrow or first arrow line not found in the DOM');
    }


    arrowsClickListener(svg,
        geojsonData,
        summitData,
        //currentYearIndex,
        countriesWithSummits,
        cumulativeSummits,
        summitsByCountryMap);
}

export function initDesktopTimeline(geojsonData, summitData, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits) {
    const svg = initDesktopTimelineSVG();
    const displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow);
    // Initialize the default page
    initializePage(svg, geojsonData, summitData, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap);

    // Add event listener to the "Animate" button
    const animateButton = document.getElementById("playButtonDesktop");
    const pauseButton = document.getElementById("pauseButtonDesktop");
    animateButton.addEventListener("click", function () {
        if (!isPlaying) {
            playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits, currentYearIndex,
                highlightIndex);
        }
    });
    pauseButton.addEventListener("click", () => {
        if (isPlaying) {
            stopTimeline();
        }
    });


    // Ensure arrow event listeners are attached
    arrowsClickListener(svg,
        geojsonData,
        summitData,
        currentYearIndex,
        countriesWithSummits,
        cumulativeSummits,
        summitsByCountryMap);
}
function playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits, currentYearIndex, highlightIndex) {
    console.log("Countries with summits in playtimeline", countriesWithSummits);
    generalCounter = 0;
    //function startPlaying(currentYearIndex, highlightIndex) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        console.log(
            "Start playing function: Current year input",
            currentYearIndex,
            "Highlight year input",
            highlightIndex
        );
        console.log("Summit data", summitData);
        console.log("General counter", generalCounter);
        //console.log('Summit counter values', summitCounter);
        const currentYearData = summitData[generalCounter];
        const hostCountry = currentYearData.summits.map(
            (summit) => summit.country
        );
        const currentYear = currentYearData.year;
        console.log("Host country is", hostCountry);
        let displayedYears = summitData.slice(currentYearIndex,currentYearIndex + maxYearsToShow);
        //console.log('Current year', currentYear)
        drawTimeline(svg, geojsonData, summitData, currentYearIndex, displayedYears, countriesWithSummits, cumulativeSummits, summitsByCountryMap
        );
        highlightItem(svg, summitData, highlightIndex, currentYearIndex); // Highlight the current year
        updateMap(
            geojsonData,
            summitMap,
            currentYear,
            summitsByCountryMap,
            hostCountry,
            summitCounter,
            countriesWithSummits
        );
        highlightIndex += 1;
        generalCounter += 1;
        console.log("General counter is", generalCounter);
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
                    cumulativeSummits
                );
            } else {
                // Display the next set of 5 years
                generateTimeline(
                    svg,
                    geojsonData,
                    summitData,
                    currentYearIndex,
                    displayedYears,
                    countriesWithSummits,
                    cumulativeSummits,
                    summitsByCountryMap
                );
            }
        }
        if (currentYearIndex >= summitData.length) {
            clearInterval(intervalId); // Stop at the end of the timeline
            playPauseBtn.innerHTML =
                // '<img src="/src/img/play-white.svg" class="play-med img-fluid" alt="Play button"> Play'; // Reset button to Play
                '<img src="/src/img/play-white.svg" class="play-med" alt="Play button">';
            isPlaying = false;
        }
        console.log(
            "Checking if values save correctly",
            currentYearIndex,
            highlightIndex
        );
    }, 500);
    //}
    // Play/Pause button logic
    const playPauseBtn = document.getElementById("playButtonDesktop");
    playPauseBtn.addEventListener("click", function () {
        console.log(
            "PLAY BUTTON CLICKED AND CurrentIndex",
            currentYearIndex,
            "Highlight Index",
            highlightIndex
        );
        if (isPlaying) {
            // Check if is playing because we want to PAUSE
            clearInterval(intervalId); // Pause timeline
            console.log(
                "Pausing at Current Year Index:",
                currentYearIndex,
                "Highlight Index:",
                highlightIndex
            );
            playPauseBtn.innerHTML =
                '<img src="/src/img/play-white.svg" class="play-med img-fluid" alt="Play button">'; // Reset button to Play
            isPlaying = false;
        } else {
            // IF TIMELINE IS NOT PLAYING
            if (timelineEnded) {
                // If the timeline has ended, restart from the beginning
                console.log("Restarting timeline from the beginning.");
                currentYearIndex = 0; // Reset the index
                highlightIndex = 0;
                generalCounter = 0;
                resetSummitCounter();
                timelineEnded = false; // Reset the flag
                // Calling timeline finished function
                timelineFinished(svg, summitData, currentYearIndex);
            }
            // Resume from the saved current year and highlight index
            startPlaying(currentYearIndex, highlightIndex);
            console.log(
                "Resuming from Current Year Index:",
                currentYearIndex,
                "Highlight Index:",
                highlightIndex
            );
            //playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
            isPlaying = true;
            //startPlaying(currentYearIndex, highlightIndex);
        }
        // Ensure arrow event listeners are attached after animation
        arrowsClickListener(svg,
            geojsonData,
            summitData,
            currentYearIndex,
            countriesWithSummits,
            cumulativeSummits,
            summitsByCountryMap);
    });
    // Restart button
    const restartBtn = document.getElementById("restartButtonDesktop");
    restartBtn.addEventListener("click", function () {
        clearInterval(intervalId);
        currentYearIndex = 0;
        highlightIndex = 0;
        generalCounter = 0;
        resetSummitCounter();
        if (isPlaying) {
            console.log("Interval ID PAUSE", intervalId);
            clearInterval(intervalId); // Pause the timeline if already playing
        }
        // 3. Change play button to pause button and restart timeline autoplay
        //playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to pause icon
        isPlaying = true; // Set to playing
        // 4. Restart the autoplay from the beginning
        startPlaying(currentYearIndex, highlightIndex); // This function should handle the timeline progression
    });
}

function stopTimeline() {
    isPlaying = false;
    clearInterval(intervalId);
}


function addTimelineItemClickListeners(svg) {
    svg.selectAll("circle.year-item") // or whatever selector you use for your timeline items
        .on("click", function (event, d) {
            const clickedYearData = summitData[d.index]; // Get data based on the index of the clicked item
            highlightHostCountries(clickedYearData); // Highlight corresponding host countries
        });
}
export function arrowsClickListener(
    svg,
    geojsonData,
    summitData,
    currentYearIndex,
    countriesWithSummits,
    cumulativeSummits,
    summitsByCountryMap
) {
    //console.log('Summit Data in arrows click listener', summitData);
    //console.log("FIRST Current year index", currentYearIndex);
    //console.log('Summits by country map data in arrowClickListener', summitsByCountryMap);
    let currentYearafterUpdate = currentYearIndex + maxYearsToShow;
    //console.log('Current year after update before handleArrowClick', currentYearafterUpdate);
    let displayedYears;

    // Define named event handler functions to add/remove listeners
    function handleUpArrowClick() {
        console.log("Up arrow clicked");
        handleArrowClick(-maxYearsToShow);
    }
    function handleDownArrowClick() {
        console.log("Down arrow clicked");
        handleArrowClick(maxYearsToShow);
    }
    function handleArrowClick(maxYearsToShow) {
        console.log(
            "On click | Current year index",
            currentYearIndex,
            "| Current year updated",
            currentYearafterUpdate
        ); //
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
        displayedYears = summitData.slice(
            currentYearIndex,
            currentYearafterUpdate
        );
        clearCountryLabels();
        drawTimeline(
            svg,
            geojsonData,
            summitData,
            currentYearIndex,
            displayedYears,
            countriesWithSummits,
            cumulativeSummits,
            summitsByCountryMap
        );
    }
    // Attach event listeners to the arrows
    svg.selectAll(".up-arrow").on("click", handleUpArrowClick);
    svg.selectAll(".down-arrow").on("click", handleDownArrowClick);
}

function timelineFinished(
    svg,
    geojsonData,
    summitData,
    currentYearIndex,
    countriesWithSummits,
    cumulativeSummits,
    summitsByCountryMap
) {
    clearInterval(intervalId); // Clear the interval when the timeline finishes
    console.log(
        "Timeline finished - input - current year index",
        currentYearIndex
    );
    timelineEnded = true; // Set the flag to true when the timeline ends
    addTimelineItemClickListeners(svg);
    arrowsClickListener(svg,
        geojsonData,
        summitData,
        currentYearIndex,
        countriesWithSummits,
        cumulativeSummits,
        summitsByCountryMap);
    //updateMapByYear(geojsonData, year, cumulativeSummits)
}
function resetSummitCounter() {
    console.log("Clearing summitCounter...");
    summitCounter.clear();
    console.log("Summit counter after clearing:", summitCounter);
}