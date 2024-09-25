import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { initializeTimeline, updateTimeline, autoAdvanceTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData } = await loadAndMergeData(geojsonUrl, jsonPath);
        console.log('Summit map passed', summitMap)

        // Set up scrolling or interaction for the timeline
        initializeTimeline()
        autoAdvanceTimeline(jsonData, geojsonData, summitMap)

    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


