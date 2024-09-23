import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { autoAdvanceTimeline, updateTimeline } from "./modules/timelineUtils.js";

async function main() {
    try {
        const mergedGeoData = await loadAndMergeData(geojsonUrl, jsonPath)
        const geojsonData = mergedGeoData.geojsonData;
        const summitData = mergedGeoData.jsonData;
        drawMap(geojsonData);

        // Initialize the timeline with the first 5 years
        updateTimeline(summitData, geojsonData);

        // Auto-advance the timeline at a set interval (every 5 seconds here)
        autoAdvanceTimeline(summitData, geojsonData);
       
    } catch (error) {
        console.error("Error loading data:", error);
    }
}
main();


