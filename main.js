import { loadAndMergeData } from "./modules/common/dataLoader.js";
import { jsonPath, geojsonUrl } from "./modules/common/globals.js";
import { initMobileTimeline } from "./modules/mobile/initMobile.js";
import { initDesktopTimeline } from "./modules/desktop/initDesktop.js";

async function main() {
    try {
        // Load and merge data
        const { geojsonData, summitMap, jsonData, summitsByCountryMap, countriesWithSummits, cumulativeSummits } = await loadAndMergeData(geojsonUrl, jsonPath);
        //console.log('Cumulative summits', cumulativeSummits);
        //let summitCounter = new Map();
        // Detect screen size and initialize appropriate timeline
        if (window.innerWidth >= 768) {
            // Desktop version
            initDesktopTimeline(geojsonData, jsonData, summitMap, summitsByCountryMap, countriesWithSummits, cumulativeSummits /*, jsonData, summitCounter*/);
        } else {
            // Mobile version
            console.log('Summits with countrries', countriesWithSummits)
            console.log('Summits by country map', summitsByCountryMap)
            initMobileTimeline(geojsonData, jsonData, cumulativeSummits, jsonData, summitsByCountryMap /*, summitCounter*/);
        }
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}
main();


