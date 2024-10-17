import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl, maxYearsToShow } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { initializeTimeline, advanceTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap } = await loadAndMergeData(geojsonUrl, jsonPath);
        //console.log('Summit map', summitMap)
        console.log('summity by country map', summitsByCountryMap)
        // Initialize the timeline (draw it once)
        const svg = initializeTimeline();
        let currentYearIndex = 0;
        let highlightIndex = 0;
        // Function to auto-advance the timeline
        drawMap(geojsonData)
        const intervalId = setInterval(() => {
            if (highlightIndex < maxYearsToShow - 1) {
                highlightIndex++;  // Move to the next year
            } else {
                highlightIndex = 0;  // Loop back to the start if at the end
            }
            advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex);
            currentYearIndex++;
        }, 500);  // Adjust timing as needed
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


