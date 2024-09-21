import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { drawMap } from "./modules/mapUtils.js";

async function main() {
    try {
        const mergedGeoData = await loadAndMergeData(geojsonUrl, jsonPath)
        const geojsonData = mergedGeoData.geojsonData
        drawMap(geojsonData);

    }
    catch (error) {
        console.error("Error loading data:", error);
    }
}

main();


