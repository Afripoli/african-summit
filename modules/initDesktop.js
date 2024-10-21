import { initDesktopTimelineSVG } from "./timelineUtils";

export function initDesktopTimeline(geojsonData, summitMap, jsonData, summitsByCountryMap, summitCounter) {
    const svg = initDesktopTimelineSVG();
    let currentYearIndex = 0;
    let highlightIndex = 0;
    let summitCounter = new Map();
    drawMap(geojsonData);
    const startInterval = () => {
        return setInterval(() => {
            if (highlightIndex < maxYearsToShow - 1) {
                highlightIndex++;  // Move to the next year
            } else {
                highlightIndex = 0;  // Loop back to the start if at the end
            }
            advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex, summitCounter);
            currentYearIndex++;
        }, 200)
    }

    let intervalId = startInterval();
    function resetSummitCounter() {
        summitCounter.clear();
    }
    document.getElementById('restartButtonDesktop').addEventListener('click', () => {
        resetSummitCounter();
        clearInterval(intervalId);
        currentYearIndex = 0;
        highlightIndex = 0;
        intervalId = startInterval();  // Start a new interval
        console.log("Timeline restarted for desktop");
    });
}