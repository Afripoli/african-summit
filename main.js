import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl, maxYearsToShow } from "./modules/globals.js";
import { drawMap } from "./modules/mapUtils.js";
import { initDesktopTimeline, advanceTimeline, mobileTimeline, initMobileTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap } = await loadAndMergeData(geojsonUrl, jsonPath);
        let currentYearIndex = 0;
        let highlightIndex = 0;
        let summitCounter = new Map();
        drawMap(geojsonData);
        //const mobileTimeDiv = document.getElementById('mobile-timeline');
        const svg = initDesktopTimeline();

        const startInterval = () => {
            return setInterval(() => {
                /* Mobile version */
                // if (window.innerWidth < 768) {
                //     console.log('DISPLAYING MOBILE TIMELINE')
                //     const mobileSvg = initMobileTimeline();
                //     mobileTimeline(mobileSvg, jsonData, currentYearIndex);
                //     currentYearIndex++;
                // } else {
                    console.log('DISPLAYING DESKTOP TIMELINE');
                    if (highlightIndex < maxYearsToShow - 1) {
                        highlightIndex++;  // Move to the next year
                    } else {
                        highlightIndex = 0;  // Loop back to the start if at the end
                    }
                    advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex, summitCounter);
                    currentYearIndex++;
                //}
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
            console.log("Timeline restarted");
        });
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


