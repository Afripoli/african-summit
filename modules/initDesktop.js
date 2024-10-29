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

function playTimeline(svg, summitData, geojsonData, summitMap, summitsByCountryMap, countriesWithSummits) {
    console.log('Countries with summits in playtimeline', countriesWithSummits)
    generalCounter = 0
    //console.log('Function PLAYTIMELINE ACTIVATED')
    function startPlaying(currentYearIndex, highlightIndex) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            console.log('Start playing function: Current year input', currentYearIndex, 'Highlight year input', highlightIndex)
            console.log('Summit data', summitData);
            console.log('General counter', generalCounter);
            //console.log('Summit counter values', summitCounter);
            const currentYearData = summitData[generalCounter];
            const hostCountry = currentYearData.summits.map(summit => summit.country);
            const currentYear = currentYearData.year;
            console.log('Host country is', hostCountry);
            let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
            //console.log('Current year', currentYear)
            drawTimeline(svg, summitData, displayedYears, countriesWithSummits);
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
                    timelineFinished(svg, summitData, currentYearIndex, countriesWithSummits);
                } else {
                    // Display the next set of 5 years
                    generateTimeline(svg, summitData, displayedYears);
                }
            }
            if (currentYearIndex >= summitData.length) {
                clearInterval(intervalId);  // Stop at the end of the timeline
                playPauseBtn.innerHTML = '<img src="/src/img/play-white.svg" class="play-med img-fluid" alt="Play button"> Animate';  // Reset button to Play
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
                // Calling timeline finished function
                timelineFinished(svg, summitData, currentYearIndex);
            }
            // Resume from the saved current year and highlight index
            startPlaying(currentYearIndex, highlightIndex);
            console.log('Resuming from Current Year Index:', currentYearIndex, 'Highlight Index:', highlightIndex);
            //playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to play icon
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
        //playPauseBtn.innerHTML = '<img src="/src/img/pause-white.svg" class="play-med img-fluid" alt="Pause button">'; // Change to pause icon
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
function arrowsClickListener(svg, summitData, currentYearIndex, countriesWithSummits) {
    console.log('FIRST Current year index', currentYearIndex)
    let currentYearafterUpdate = currentYearIndex;
    let displayedYears;

    const upArrowDiv = document.querySelector('.up-arrow');
    const downArrowDiv = document.querySelector('.down-arrow');

    // Check if the elements exist
    if (!upArrowDiv || !downArrowDiv) {
        console.error('Arrow elements not found in the DOM');
        return;
    }

     // Remove any existing listeners to prevent duplicate events
    upArrowDiv.removeEventListener("click", handleUpArrowClick);
    downArrowDiv.removeEventListener("click", handleDownArrowClick);

    console.log('Attaching arrow event listeners');
    attachArrowEventListeners();

    function handleArrowClick(maxYearsToShow) {
        console.log('On click | Current year index', currentYearIndex, '| Current year updated', currentYearafterUpdate) // 
        if (maxYearsToShow < 0) { // Click Arrow up
            // Timeline clicking reached the beginning
            if (currentYearIndex === 0) currentYearIndex = summitData.length;
            currentYearafterUpdate = currentYearIndex;
            currentYearIndex = currentYearIndex + maxYearsToShow;
            displayedYears = summitData.slice(currentYearIndex, currentYearafterUpdate);
        } else { // Click arrow down
            // Timeline clicking reached the end
            if (currentYearafterUpdate >= summitData.length) currentYearafterUpdate = 0;
            currentYearIndex = currentYearafterUpdate;
            currentYearafterUpdate = currentYearIndex + maxYearsToShow;
            displayedYears = summitData.slice(currentYearIndex, currentYearafterUpdate);   
        }
        drawTimeline(svg, summitData, displayedYears, countriesWithSummits);
    }

    // Define named event handler functions to add/remove listeners
    function handleUpArrowClick() { 
        console.log("Up arrow clicked");
        handleArrowClick(-maxYearsToShow); 
    }
    
    function handleDownArrowClick() { 
        console.log("Down arrow clicked");
        handleArrowClick(maxYearsToShow); 
    }

    function attachArrowEventListeners() {
        upArrowDiv.addEventListener("click", handleUpArrowClick);
        downArrowDiv.addEventListener("click", handleDownArrowClick);
    }
    // Initial attachment of arrow listeners
    //attachArrowEventListeners();
}

function timelineFinished(svg, summitData, currentYearIndex, countriesWithSummits) {
    clearInterval(intervalId);  // Clear the interval when the timeline finishes
    console.log('Timeline finished - input - current year index', currentYearIndex)
    appendUpArrow();
    appendDownArrow();
    timelineEnded = true;  // Set the flag to true when the timeline ends
    addTimelineItemClickListeners(svg);
    arrowsClickListener(svg, summitData, currentYearIndex, countriesWithSummits);
    //highlightClickedItem(svg, clickedData)
}
function resetSummitCounter() {
    console.log('Clearing summitCounter...');
    summitCounter.clear();
    console.log('Summit counter after clearing:', summitCounter);
}

export function initDesktopTimeline(geojsonData, summitData, summitMap, summitCounter, summitsByCountryMap, countriesWithSummits) {
    const svg = initDesktopTimelineSVG();  // Initialize the timeline SVG
    // Initially display the first 5 years
    let displayedYears = summitData.slice(currentYearIndex, currentYearIndex + maxYearsToShow)
    console.log('Displaying years by default', displayedYears)
    generateTimeline(svg, summitData, displayedYears);
    drawMap(geojsonData);
    // Initialize play/pause functionality
    playTimeline(svg, summitData, geojsonData, summitMap, summitCounter, summitsByCountryMap, countriesWithSummits);
}
