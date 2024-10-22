import { initMobileTimelineSVG, mobileTimeline } from './timelineUtils.js';
import { drawMap } from "./mapUtils.js";

export function initMobileTimeline(geojsonData, summitMap, jsonData, summitsByCountryMap, summitCounter) {
    const svg = initMobileTimelineSVG();

    let currentYearIndex = 0;
    let highlightIndex = 0;
    drawMap(geojsonData);

    const startInterval = () => {
        return setInterval(() => {
            mobileTimeline(svg, jsonData, currentYearIndex);
            currentYearIndex++;
        }, 200)
    }
    let intervalId = startInterval();
    function resetSummitCounter() {
        summitCounter.clear();
    }
    document.getElementById('restartButtonMobile').addEventListener('click', () => {
        resetSummitCounter();
        clearInterval(intervalId);
        currentYearIndex = 0;
        highlightIndex = 0;
        intervalId = startInterval();  // Start a new interval
        console.log("Timeline restarted for mobile");
    });

}