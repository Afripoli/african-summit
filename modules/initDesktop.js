import { initDesktopTimelineSVG, advanceTimeline } from "./timelineUtils.js";
import { maxYearsToShow } from "./globals.js";
import { drawMap } from "./mapUtils.js";

export function initDesktopTimeline(geojsonData, summitMap, jsonData, summitsByCountryMap, summitCounter) {
    const svg = initDesktopTimelineSVG();
    let currentYearIndex = 0;
    let highlightIndex = 0;
    let intervalId = null;
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
        }, 400)
    }
    function resetSummitCounter() {
        summitCounter.clear();
    }
    document.getElementById('restartButtonDesktop').addEventListener('click', () => {
        resetSummitCounter();
        if (intervalId) {
            clearInterval(intervalId);
        } 
        currentYearIndex = 0;
        highlightIndex = 0;
        intervalId = startInterval();  // Start or restart the timeline
        console.log("Timeline started/restarted for desktop");
    });
}