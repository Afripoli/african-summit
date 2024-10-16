import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl, highlightIndex } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { initializeTimeline, updateTimeline, advanceTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap } = await loadAndMergeData(geojsonUrl, jsonPath);
        //console.log('Summit map', summitMap)
        console.log('summity by country map', summitsByCountryMap)
        // Initialize the timeline (draw it once)
        const svg = initializeTimeline();
        let currentYearIndex = 0;
        // Function to auto-advance the timeline
        const intervalId = setInterval(() => {
            advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId, summitsByCountryMap, highlightIndex);
            currentYearIndex++;
        }, 200);  // Adjust timing as needed

    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


