import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { initializeTimeline, updateTimeline, advanceTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData } = await loadAndMergeData(geojsonUrl, jsonPath);
        console.log('Summit map passed', summitMap)

        // Set up scrolling or interaction for the timeline
        // Initialize the timeline (draw it once)
        const svg = initializeTimeline();
        let currentYearIndex = 0;
        // Function to auto-advance the timeline
        const intervalId = setInterval(() => {
            advanceTimeline(svg, jsonData, geojsonData, summitMap, currentYearIndex, intervalId);
            currentYearIndex++;
        }, 2000);  // Adjust timing as needed

    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


