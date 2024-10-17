import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl, maxYearsToShow } from "./modules/globals.js";
import { drawMap } from "./modules/mapUtils.js";
import { initializeTimeline, advanceTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap } = await loadAndMergeData(geojsonUrl, jsonPath);
        //console.log('Summit map', summitMap)
        console.log('summity by country map', summitsByCountryMap)
        const svg = initializeTimeline();
        let currentYearIndex = 0;
        let highlightIndex = 0;
        let summitCounter = new Map();
        // Function to auto-advance the timeline
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
            }, 500)
        }

        let intervalId = startInterval();
        function resetSummitCounter() {
            summitCounter.clear();
       }
       
        document.getElementById('restartButton').addEventListener('click', () => {
            // Clear the existing interval
            resetSummitCounter();

            clearInterval(intervalId);

            // Reset indexes
            currentYearIndex = 0;
            highlightIndex = 0;

            // Restart the timeline
            intervalId = startInterval();  // Start a new interval
            console.log("Timeline restarted");
        });

        // const intervalId = setInterval(() => {
        //     if (highlightIndex < maxYearsToShow - 1) {
        //         highlightIndex++;  // Move to the next year
        //     } else {
        //         highlightIndex = 0;  // Loop back to the start if at the end
        //     }
        //     advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex);
        //     currentYearIndex++;
        // }, 500);  // Adjust timing as needed
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


