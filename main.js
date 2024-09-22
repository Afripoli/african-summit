import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { drawMap, updateMap } from "./modules/mapUtils.js";
import { drawTimeline } from "./modules/drawTimeline.js";

async function main() {
    try {
        const mergedGeoData = await loadAndMergeData(geojsonUrl, jsonPath)
        const geojsonData = mergedGeoData.geojsonData;
        const summitData = mergedGeoData.jsonData;
        drawMap(geojsonData);
        let timeline = drawTimeline(summitData)
        timeline.on("click", (event, d) => {
            const countries = d.summits.map(summit => summit.country);
            updateMap(geojsonData, countries);
        });
    } catch (error) {
        console.error("Error loading data:", error);
    }
}
main();


