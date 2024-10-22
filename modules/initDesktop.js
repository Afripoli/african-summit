import { initDesktopTimelineSVG, generateTimeline } from "./timelineUtils.js";
// import { drawMap } from "./mapUtils.js";

export function initDesktopTimeline(geojsonData, jsonData /*, summitMap, summitsByCountryMap, summitCounter*/) {
   // const svg = initDesktopTimelineSVG();
    let currentYearIndex = 0;
    let highlightIndex = 0;
    let intervalId = null;
   // drawMap(geojsonData);
    // generateTimeline(svg, jsonData)
    // const startInterval = () => {
    //     return setInterval(() => {
    //         advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex, summitCounter);
    //         currentYearIndex++;
    //     }, 200)
    // }
    // function resetSummitCounter() {
    //     summitCounter.clear();
    // }
    document.getElementById('restartButtonDesktop').addEventListener('click', () => {
        // resetSummitCounter();
        // if (intervalId) {
        //     clearInterval(intervalId);
        // } 
        const svg = initDesktopTimelineSVG();
        currentYearIndex = 0;
        generateTimeline(svg, jsonData)
        //highlightIndex = 0;
        //intervalId = startInterval();  // Start or restart the timeline
        console.log("Timeline started/restarted for desktop");
    });
}