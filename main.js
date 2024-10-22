import { loadAndMergeData } from "./modules/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/globals.js";
import { initMobileTimeline } from "./modules/initMobile.js";
import { initDesktopTimeline } from "./modules/initDesktop.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap } = await loadAndMergeData(geojsonUrl, jsonPath);
        let summitCounter = new Map();
        // Detect screen size and initialize appropriate timeline
        if (window.innerWidth >= 768) {
            // Desktop version
            initDesktopTimeline(geojsonData, jsonData /*, summitMap, jsonData, summitsByCountryMap, summitCounter*/);
        } else {
            // Mobile version
            initMobileTimeline(geojsonData, jsonData /*,  summitMap, jsonData, summitsByCountryMap, summitCounter*/);
        }
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


